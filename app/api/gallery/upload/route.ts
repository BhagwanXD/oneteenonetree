import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { buildSeoCaption, slugify } from '@/lib/gallery'

export const runtime = 'nodejs'

const templateOptions = new Set(['impact', 'volunteer', 'drive', 'thankyou', 'onetree'])
const sizeOptions = new Set(['square', 'portrait', 'story'])

const normalize = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : ''

const requireAdmin = async (supabase: ReturnType<typeof createRouteHandlerClient>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const role = (profile as { role?: string | null } | null)?.role
  if (role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true, userId: user.id }
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
  }

  const title = normalize(form.get('title'))
  const template = normalize(form.get('template'))
  const size = normalize(form.get('size'))
  const ctaLink = normalize(form.get('ctaLink'))
  const city = normalize(form.get('city'))
  const dateValue = normalize(form.get('date'))
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : ''

  if (!title) {
    return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
  }
  if (!templateOptions.has(template)) {
    return NextResponse.json({ error: 'Invalid template.' }, { status: 400 })
  }
  if (!sizeOptions.has(size)) {
    return NextResponse.json({ error: 'Invalid size.' }, { status: 400 })
  }
  if (title.length > 120 || city.length > 80 || ctaLink.length > 300) {
    return NextResponse.json({ error: 'Invalid input length.' }, { status: 400 })
  }

  const yearSegment = new Date().getFullYear()
  const safeTitle = slugify(title) || 'poster'
  const path = `gallery/${yearSegment}/${safeTitle}-${crypto.randomUUID()}.png`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(path, arrayBuffer, {
      contentType: 'image/png',
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const seoCaption = buildSeoCaption({ template, title, city })
  const year = validDate ? Number.parseInt(validDate.split('-')[0] ?? '', 10) : null

  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      image_path: path,
      caption: title,
      city: city || null,
      year: Number.isFinite(year) ? year : null,
      title,
      template,
      size,
      cta_link: ctaLink || null,
      taken_on: validDate || null,
      seo_caption: seoCaption,
      is_published: true,
      created_by: guard.userId,
    })
    .select('id, image_path')
    .single()

  if (error) {
    await supabase.storage.from('gallery').remove([path])
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ item: data })
}
