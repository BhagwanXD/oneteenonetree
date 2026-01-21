import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import PledgeForm from './PledgeForm'
import PledgeStats from './PledgeStats'
import SignInButton from './SignInButton'
import Icon from '@/components/Icon'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Pledge - OneTeenOneTree',
  description:
    'Take the pledge to plant a tree and inspire your friends to join a youth-led climate movement.',
  openGraph: {
    title: 'Pledge - OneTeenOneTree',
    description:
      'Take the pledge to plant a tree and inspire your friends to join a youth-led climate movement.',
    url: '/pledge',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function PledgePage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pledgeRows } = await supabase
    .from('pledges')
    .select('trees,school,city,created_at')
    .order('created_at', { ascending: false })

  const totalPledges = pledgeRows?.length ?? 0
  const totalTrees =
    pledgeRows?.reduce((sum, row) => sum + (Number(row.trees) || 0), 0) ?? 0
  const schools = new Set(
    (pledgeRows ?? []).map((row) => (row.school || '').trim()).filter(Boolean)
  ).size
  const cities = new Set(
    (pledgeRows ?? []).map((row) => (row.city || '').trim()).filter(Boolean)
  ).size
  const lastUpdated = pledgeRows?.[0]?.created_at ?? null
  const hasStats = totalPledges > 0 || totalTrees > 0 || schools > 0 || cities > 0

  let profile: {
    name: string | null
    country: string | null
    state: string | null
    city: string | null
    school: string | null
  } | null = null
  let hasPledged = false

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('name,country,state,city,school')
      .eq('id', user.id)
      .single()
    profile = data ?? null

    const { data: existingPledge } = await supabase
      .from('pledges')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
    hasPledged = (existingPledge ?? []).length > 0
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0E1512]">
      {!user ? (
        <>
          <section className="py-12">
            <div className="container text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Take the OneTeenOneTree Pledge
              </h1>
              <p className="text-white/70 text-lg">
                Commit to planting at least one tree and inspire others to take real climate action.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <SignInButton className="btn">
                  Sign in to take the pledge
                </SignInButton>
                <a href="#how-it-works" className="text-white/70 hover:text-white underline">
                  See how it works
                </a>
              </div>
              <p className="text-xs text-white/50">
                We only use your Google account to track pledges. No spam.
              </p>
            </div>
          </section>

          <section id="how-it-works" className="py-12">
            <div className="container">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
                What your pledge means
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <PledgeStep
                  icon={<Icon name="eco" size={22} aria-hidden="true" />}
                  title="Commit"
                  description="Pledge to plant at least one tree."
                />
                <PledgeStep
                  icon={<Icon name="camera" size={22} aria-hidden="true" />}
                  title="Verify"
                  description="Upload a photo after planting."
                />
                <PledgeStep
                  icon={<Icon name="award" size={22} aria-hidden="true" />}
                  title="Inspire"
                  description="Earn badges and climb the leaderboard."
                />
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
                Growing together
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {hasStats ? (
                  <>
                    {totalPledges > 0 && (
                      <StatTile label="Pledges" value={totalPledges.toLocaleString()} />
                    )}
                    {totalTrees > 0 && (
                      <StatTile label="Trees pledged" value={totalTrees.toLocaleString()} />
                    )}
                    {schools > 0 && (
                      <StatTile label="Schools" value={schools.toLocaleString()} />
                    )}
                    {cities > 0 && (
                      <StatTile label="Cities" value={cities.toLocaleString()} />
                    )}
                  </>
                ) : (
                  <>
                    <StatTile label="Growing daily" value="New teams forming" muted />
                    <StatTile label="Local action" value="City chapters in progress" muted />
                    <StatTile label="Community" value="Volunteers onboarding" muted />
                  </>
                )}
              </div>
              {lastUpdated ? (
                <p className="text-center text-xs text-white/50 mt-4">
                  Last updated {new Date(lastUpdated).toLocaleDateString()}
                </p>
              ) : null}
            </div>
          </section>

          <section className="py-12">
            <div className="container">
              <div className="card max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-white">After you sign in</h2>
                <ul className="mt-4 space-y-2 text-white/70 text-sm list-disc list-inside">
                  <li>Create your pledge</li>
                  <li>Plant safely</li>
                  <li>Upload proof</li>
                  <li>Track your impact</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container">
              <div className="card text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Ready to make it official?
                </h2>
                <SignInButton className="btn justify-center">
                  Continue with Google
                </SignInButton>
                <Link href="/leaderboard" className="text-white/70 hover:text-white underline">
                  View leaderboard
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
          <header className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Take the OneTeenOneTree Pledge
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Join students around the world. Make your pledge and inspire others to plant.
            </p>
          </header>

          {!profile?.name ? (
            <section className="mx-auto max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 text-center">
                <p className="text-white/80">Finish your profile once to continue.</p>
                <a href="/dashboard" className="btn mt-4">
                  Go to Dashboard
                </a>
              </div>
            </section>
          ) : hasPledged ? (
            <section className="mx-auto max-w-2xl">
              <div className="card text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">You already pledged</h2>
                <p className="text-white/70">
                  Thanks for making it official. Keep going by sharing proof or checking your
                  impact.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/pledge/success" className="btn justify-center">
                    View your pledge
                  </Link>
                  <Link href="/plant" className="text-white/70 hover:text-white underline">
                    Upload proof
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <PledgeForm userId={user.id} />
          )}

          <PledgeStats />
        </div>
      )}
    </div>
  )
}

function PledgeStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center space-y-3">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white text-xl">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  )
}

function StatTile({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
      <div className="text-sm text-white/60">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${muted ? 'text-white/70' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}
