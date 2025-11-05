// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // This refreshes the session and attaches cookies to the response,
  // so Server Components (like your pledge page) can read the user.
  await supabase.auth.getSession()

  return res
}

export const config = {
  // Run middleware only where server-side auth/session is actually needed
  matcher: [
    '/dashboard/:path*',
    '/pledge/:path*',
    '/plant/:path*',
    '/admin/:path*',
  ],
}
