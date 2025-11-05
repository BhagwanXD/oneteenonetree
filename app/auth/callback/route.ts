import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

function getSafeNext(url: URL) {
  const next = url.searchParams.get('next') || '/'
  try {
    const u = new URL(next, url.origin)
    if (u.origin === url.origin) return u.pathname + u.search + u.hash
  } catch {}
  return '/'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const error = url.searchParams.get('error')
  if (error) {
    // Surface provider or oauth errors back to the app
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, url.origin))
  }

  const code = url.searchParams.get('code')
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const { error: exchError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchError) {
        console.error('Supabase exchangeCodeForSession error:', exchError)
        return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(exchError.message)}`, url.origin))
      }
    } catch (e: any) {
      console.error('Auth callback exception:', e)
      return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(e?.message ?? 'auth_failed')}`, url.origin))
    }
  }

  return NextResponse.redirect(new URL(getSafeNext(url), url.origin))
}
