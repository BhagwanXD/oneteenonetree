import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { adminSections } from './admin-sections'

export const metadata = {
  title: 'Admin Dashboard - OneTeenOneTree',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-white/60">
          Manage reviews, social posts, and site content.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href} className="btn">
            Go to {section.navLabel}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {adminSections.map((section) => (
          <div key={section.href} className="card flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-white/60">{section.description}</p>
            </div>
            <Link href={section.href} className="btn w-fit">
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
