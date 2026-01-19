import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SignInButton from '@/app/pledge/SignInButton'
import { SignOutButton } from '@/components/AuthButtons'
import ClientAuthDebug from './ClientAuthDebug'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Debug Auth - OneTeenOneTree',
  robots: { index: false, follow: false },
}

function mask(v: string, visible = 4) {
  if (!v) return ''
  const len = v.length
  if (len <= visible) return '*'.repeat(len)
  return `${v.slice(0, 2)}…${v.slice(-visible)}`
}

export default async function DebugAuthPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [{ data: userData, error: userError }, { data: sessionData, error: sessionError }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ])

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold text-white">Debug: Auth</h1>

      <div className="flex items-center gap-3">
        <SignInButton className="btn" />
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-white/80 text-sm">Server</div>
          <div className="text-white text-sm mt-2 space-y-1">
            <div>userId: <span className="text-white/70">{userData.user?.id ?? 'null'}</span></div>
            <div>email: <span className="text-white/70">{userData.user?.email ?? 'null'}</span></div>
            <div>hasSession: <span className="text-white/70">{String(!!sessionData.session)}</span></div>
            {userError && <div className="text-red-400">getUser error: {userError.message}</div>}
            {sessionError && <div className="text-red-400">getSession error: {sessionError.message}</div>}
          </div>
        </section>

        <ClientAuthDebug />
      </div>

      {/* Cookie details removed to avoid using cookies() directly here */}

      <p className="text-white/60 text-sm">Visit this page right after returning from Google to verify that cookies are set and that both server and client can see the session.</p>
    </div>
  )
}
