// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { canAccessRoute, isAuthenticated } from '@/lib/authz'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh the session and attach cookies to the response.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isPlantRoute = pathname.startsWith('/plant')
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/debug')

  if (!isProtected && !isPlantRoute) {
    return res
  }

  const user = session?.user

  if (!user?.id) {
    if (isPlantRoute) {
      return NextResponse.redirect(new URL('/pledge', req.url))
    }
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
    '/plant/:path*',
    '/admin/:path*',
    '/debug/:path*',
  ],
}
