import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { canAccessRoute } from '@/lib/authz'
import AdminNav from './admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  const access = canAccessRoute({
    pathname: '/admin',
    userId: user?.id ?? null,
    role,
  })

  if (!access.allowed) redirect('/')

  return (
    <div className="space-y-6">
      <div className="container pt-8">
        <AdminNav />
      </div>
      {children}
    </div>
  )
}
