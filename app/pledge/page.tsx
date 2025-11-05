import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PledgeForm from './PledgeForm'
import PledgeStats from './PledgeStats'

export const dynamic = 'force-dynamic'

export default async function PledgePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <section className="py-12 text-center">
        <p className="text-white/70">Please sign in to make a pledge.</p>
      </section>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name,country,state,city,school')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0E1512]">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white">🌳 One Teen One Tree <span className="text-white/80">Pledge</span></h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join students around the world. Make your pledge and inspire others to plant.
          </p>
        </header>

        {!profile?.name ? (
          <section className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 text-center">
              <p className="text-white/80">Finish your profile once to continue.</p>
              <a href="/dashboard" className="btn mt-4">Go to Dashboard</a>
            </div>
          </section>
        ) : (
          <PledgeForm userId={user.id} />
        )}

        <PledgeStats />
      </div>
    </div>
  )
}
