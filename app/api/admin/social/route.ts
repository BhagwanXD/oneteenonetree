import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { fetchOpenGraph } from '@/lib/social/og'

export const runtime = 'nodejs'

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

const parseDate = (value?: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
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
  return { ok: true, userId: user.id }
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json()
  const url = typeof payload.url === 'string' ? payload.url.trim() : ''
  const platformInput = typeof payload.platform === 'string' ? payload.platform : ''
  const titleInput = typeof payload.title === 'string' ? payload.title.trim() : ''
  const published = payload.published !== false
  const postDate = parseDate(payload.postDate)

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const detected = detectPlatform(url)
  const platform =
    platformInput === 'instagram' || platformInput === 'linkedin'
      ? platformInput
      : detected

  if (!platform) {
    return NextResponse.json({ error: 'Unsupported platform URL' }, { status: 400 })
  }

  const og = await fetchOpenGraph(url)
  const insertPayload = {
    platform,
    url,
    title: titleInput || og.title || null,
    description: og.description || null,
    image_url: og.imageUrl || null,
    post_date: postDate,
    published,
    source: 'manual',
  }

  const { data, error } = await supabase
    .from('social_posts')
    .insert(insertPayload)
    .select('id, platform, url, title, description, image_url, post_date, created_at, published, source')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ post: data })
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json()
  const id = typeof payload.id === 'string' ? payload.id : ''
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (typeof payload.title === 'string') updates.title = payload.title.trim() || null
  if (typeof payload.platform === 'string') {
    if (payload.platform === 'instagram' || payload.platform === 'linkedin') {
      updates.platform = payload.platform
    }
  }
  if (typeof payload.published === 'boolean') updates.published = payload.published
  if (typeof payload.postDate === 'string') updates.post_date = parseDate(payload.postDate)

  if (typeof payload.url === 'string' && payload.url.trim()) {
    updates.url = payload.url.trim()
    const og = await fetchOpenGraph(updates.url)
    if (!updates.title && og.title) updates.title = og.title
    if (og.description) updates.description = og.description
    if (og.imageUrl) updates.image_url = og.imageUrl
  }

  const { data, error } = await supabase
    .from('social_posts')
    .update(updates)
    .eq('id', id)
    .select('id, platform, url, title, description, image_url, post_date, created_at, published, source')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ post: data })
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json().catch(() => ({}))
  const id = typeof payload.id === 'string' ? payload.id : ''
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const { error } = await supabase.from('social_posts').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
