import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max))

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const { searchParams } = new URL(req.url)
  const platform = searchParams.get('platform')
  const offset = Number(searchParams.get('offset') || 0)
  const limit = clamp(Number(searchParams.get('limit') || 9), 1, 24)

  const query = supabase
    .from('social_posts')
    .select(
      'id, platform, url, title, description, image_url, post_date, created_at'
    )
    .eq('published', true)
    .order('post_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const filtered = platform === 'instagram' || platform === 'linkedin'
    ? query.eq('platform', platform)
    : query

  const { data, error } = await filtered
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ posts: data ?? [] })
}
