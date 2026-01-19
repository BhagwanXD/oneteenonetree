import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { canAccessRoute } from '@/lib/authz'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const access = canAccessRoute({
    pathname: '/dashboard',
    userId: user?.id ?? null,
    role: null,
  })

  if (!access.allowed) redirect('/')

  return children
}
