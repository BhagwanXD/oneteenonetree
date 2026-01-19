import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Helpers
async function fileToBuffer(file: File) {
  const arr = Buffer.from(await file.arrayBuffer())
  return arr
}

async function ensureSubfolder(drive: any, parentId: string, name: string) {
  // Try to find an existing folder
  const { data } = await drive.files.list({
    q: `'${parentId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id,name)'
  })
  if (data.files?.[0]?.id) return data.files[0].id

  // Create if not found
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id'
  })
  return res.data.id!
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const form = await req.formData()
    const caption = String(form.get('caption') || '')
    const note = String(form.get('note') || '')

    // Collect files
    const files = form.getAll('files') as File[]
    if (!files.length) return new NextResponse('No files', { status: 400 })

    // 1) Create planting row (status=submitted)
    const { data: planting, error: insErr } = await supabase
      .from('plantings')
      .insert([{ user_id: user.id, caption, note, status: 'submitted' }])
      .select('id')
      .single()
    if (insErr || !planting) throw new Error(insErr?.message || 'Insert failed')

    // 2) Google Drive auth
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })
    const drive = google.drive({ version: 'v3', auth })

    // 3) Determine folder structure
    const ROOT = process.env.GDRIVE_FOLDER_ID! // Your main folder ID
    const userFolderId = await ensureSubfolder(drive, ROOT, user.id)
    const plantingFolderId = await ensureSubfolder(drive, userFolderId, planting.id)

    // 4) Upload files
    const uploaded: { type: 'photo'|'video'; id: string; name: string; webViewLink?: string }[] = []
    for (const f of files) {
      const buf = await fileToBuffer(f)
      const res = await drive.files.create({
        requestBody: {
          name: f.name,
          parents: [plantingFolderId],
        },
        media: { mimeType: f.type, body: Buffer.from(buf) },
        fields: 'id,name,webViewLink'
      })
      // Mark type by mime
      const kind: 'photo'|'video' =
        f.type.startsWith('video/') ? 'video' : 'photo'
      uploaded.push({
        type: kind,
        id: res.data.id!,
        name: res.data.name!,
        webViewLink: res.data.webViewLink ?? undefined,
      })
    }

    // 5) Save media metadata to plantings
    const { error: updErr } = await supabase
      .from('plantings')
      .update({ media: uploaded, storage: 'gdrive' })
      .eq('id', planting.id)
    if (updErr) throw new Error(updErr.message)

    return NextResponse.json({ ok: true, id: planting.id })
  } catch (e: any) {
    console.error('[plant/submit]', e)
    return new NextResponse(e?.message || 'Error', { status: 500 })
  }
}
