// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { canAccessRoute, isAuthenticated } from '@/lib/authz'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // This refreshes the session and attaches cookies to the response,
  // so Server Components (like your pledge page) can read the user.
  await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/debug')

  if (!isProtected) {
    return res
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    const loginUrl = new URL('/', req.url)
    const nextValue = `${req.nextUrl.pathname}${req.nextUrl.search}`
    loginUrl.searchParams.set('next', nextValue)
    return NextResponse.redirect(loginUrl)
  }

  let role: string | null = null
  if (pathname.startsWith('/admin') || pathname.startsWith('/debug')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  const access = canAccessRoute({
    pathname,
    userId: user.id,
    role,
  })

  if (!access.allowed) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  // Run middleware only where server-side auth/session is actually needed
  matcher: [
    '/dashboard/:path*',
    '/pledge/:path*',
    '/plant/:path*',
    '/admin/:path*',
    '/debug/:path*',
  ],
}
