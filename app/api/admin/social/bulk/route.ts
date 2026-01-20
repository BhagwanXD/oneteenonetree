import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { parseSocialCsv } from '@/lib/social/csv'

export const runtime = 'nodejs'

const maxRows = 200
const maxTitleLength = 200
const maxUrlLength = 500

const detectPlatform = (value: string) => {
  try {
    const host = new URL(value).hostname.toLowerCase()
    if (host.includes('instagram.com')) return 'instagram'
    if (host.includes('linkedin.com')) return 'linkedin'
  } catch {
    return null
  }
  return null
}

const parsePublished = (value: string, fallback: boolean) => {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return { ok: true, value: fallback }
  if (['true', '1', 'yes'].includes(trimmed)) return { ok: true, value: true }
  if (['false', '0', 'no'].includes(trimmed)) return { ok: true, value: false }
  return { ok: false, value: fallback }
}

const parseDate = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return { ok: true, value: null as string | null }
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return { ok: false, value: null as string | null }
  return { ok: true, value: parsed.toISOString() }
}

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
  return { ok: true }
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json().catch(() => ({}))
  const content = typeof payload.content === 'string' ? payload.content : ''
  const publishedDefault = payload.publishedDefault !== false

  if (!content.trim()) {
    return NextResponse.json({ error: 'CSV content is required.' }, { status: 400 })
  }

  const parsed = parseSocialCsv(content)
  if (parsed.rows.length === 0) {
    return NextResponse.json({ error: 'No rows found.' }, { status: 400 })
  }
  if (parsed.rows.length > maxRows) {
    return NextResponse.json({ error: 'Limit is 200 rows per import.' }, { status: 400 })
  }

  const failures: { row: number; reason: string; url?: string }[] = []
  const validRows: {
    platform: 'instagram' | 'linkedin'
    url: string
    title: string | null
    post_date: string | null
    published: boolean
    source: 'manual'
  }[] = []
  const seenUrls = new Set<string>()
  let duplicateCount = 0

  parsed.rows.forEach((row) => {
    const url = row.url.trim()
    if (!url) {
      failures.push({ row: row.rowIndex, reason: 'Missing URL.' })
      return
    }
    if (url.length > maxUrlLength) {
      failures.push({ row: row.rowIndex, reason: 'URL is too long.', url })
      return
    }
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      failures.push({ row: row.rowIndex, reason: 'Invalid URL.', url })
      return
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      failures.push({ row: row.rowIndex, reason: 'URL must be http or https.', url })
      return
    }

    const detected = detectPlatform(url)
    if (!detected) {
      failures.push({ row: row.rowIndex, reason: 'Unsupported domain.', url })
      return
    }

    const providedPlatform = row.platform.trim().toLowerCase()
    if (providedPlatform && !['instagram', 'linkedin'].includes(providedPlatform)) {
      failures.push({ row: row.rowIndex, reason: 'Invalid platform.', url })
      return
    }

    if (seenUrls.has(url)) {
      duplicateCount += 1
      return
    }
    seenUrls.add(url)

    const title = row.title.trim()
    const parsedDate = parseDate(row.postDate)
    if (!parsedDate.ok) {
      failures.push({ row: row.rowIndex, reason: 'Invalid post_date.', url })
      return
    }

    const parsedPublished = parsePublished(row.published, publishedDefault)
    if (!parsedPublished.ok) {
      failures.push({ row: row.rowIndex, reason: 'Invalid published value.', url })
      return
    }

    validRows.push({
      platform: detected,
      url,
      title: title ? title.slice(0, maxTitleLength) : null,
      post_date: parsedDate.value,
      published: parsedPublished.value,
      source: 'manual',
    })
  })

  let inserted: any[] = []
  if (validRows.length > 0) {
    const urls = validRows.map((row) => row.url)
    const { data: existing, error: existingError } = await supabase
      .from('social_posts')
      .select('url')
      .in('url', urls)

    if (existingError) {
      return NextResponse.json({ error: 'Failed to check duplicates.' }, { status: 500 })
    }

    const existingSet = new Set((existing ?? []).map((row) => row.url))
    if (existingSet.size > 0) {
      duplicateCount += existingSet.size
    }

    const toInsert = validRows.filter((row) => !existingSet.has(row.url))
    if (toInsert.length > 0) {
      const { data, error } = await supabase
        .from('social_posts')
        .insert(toInsert)
        .select(
          'id, platform, url, title, description, image_url, post_date, created_at, published, source'
        )
      if (error) {
        return NextResponse.json({ error: 'Bulk insert failed.' }, { status: 500 })
      }
      inserted = data ?? []
    }
  }

  return NextResponse.json({
    summary: {
      total: parsed.rows.length,
      imported: inserted.length,
      duplicates: duplicateCount,
      failed: failures,
    },
    inserted,
  })
}
