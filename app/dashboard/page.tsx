// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import ProfileForm from './profile-form'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Dashboard - OneTeenOneTree',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/pledge')

  // Fetch existing profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('name,country,state,city,school,role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'user'

  return (
    <section className="py-12 min-h-[calc(100vh-8rem)] bg-[#0E1512]">
      <div className="container max-w-2xl">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Your Dashboard</h1>
            <p className="text-white/70 mt-2">
              Set your profile once. We’ll use this across pledge, leaderboard, and other features.
            </p>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              role === 'admin'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-400 text-black'
                : 'bg-white/10 text-white/80'
            }`}
          >
            {role === 'admin' ? '👑 Admin' : '🧑‍🎓 User'}
          </div>
        </header>

        <div className="card p-6 md:p-8">
          <ProfileForm initialProfile={profile ?? null} />
        </div>
      </div>
    </section>
  )
}
