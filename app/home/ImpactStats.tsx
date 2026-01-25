import CountUp from '@/components/CountUp'
import Reveal from '@/components/Reveal'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

type Pledge = {
  trees: number | null
  school: string | null
  city: string | null
  state: string | null
  country: string | null
}

type LeaderboardEntry = {
  name?: string
  trees?: number
  school?: string
  city?: string
  state?: string
  country?: string
}

const getPledges = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('pledges')
        .select('trees,school,city,state,country')

      if (error) {
        console.error('[pledges]', error.message)
        return [] as Pledge[]
      }
      return (data ?? []) as Pledge[]
    } catch (error) {
      console.error('[pledges] fetch failed', error)
      return [] as Pledge[]
    }
  },
  ['home-pledges'],
  { revalidate: 300 }
)

const getLeaderboard = unstable_cache(
  async () => {
    const mod = await import('@/data/leaderboard.json')
    return (mod.default ?? mod) as LeaderboardEntry[]
  },
  ['home-leaderboard'],
  { revalidate: 300 }
)

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr.filter(Boolean)))
}

function sumTrees(arr: { trees?: number | null }[]) {
  return arr.reduce((a, b) => a + (Number(b.trees) || 0), 0)
}

export default async function ImpactStats() {
  const [pledges, leaderboard] = await Promise.all([getPledges(), getLeaderboard()])

  const totalPledges = pledges.length
  const verifiedTrees = sumTrees(leaderboard)
  const allSchools = uniq([
    ...pledges.map((p) => (p.school ?? '').trim()),
    ...leaderboard.map((l) => (l.school ?? '').trim()),
  ]).length
  const allCities = uniq([
    ...pledges.map((p) => [p.city, p.state, p.country].filter(Boolean).join(', ').trim()),
    ...leaderboard.map((l) => [l.city, l.state, l.country].filter(Boolean).join(', ').trim()),
  ])
    .filter(Boolean)
    .length

  return (
    <section className="py-0">
      <div className="container">
        <Reveal>
          <h2 className="text-3xl font-bold text-center">Real impact, growing daily</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Reveal>
            <div className="card">
              <div className="text-3xl font-extrabold">
                <CountUp to={totalPledges} />
              </div>
              <p className="text-white/60 mt-1">Pledges</p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="card">
              <div className="text-3xl font-extrabold">
                <CountUp to={verifiedTrees} />
              </div>
              <p className="text-white/60 mt-1">Verified Trees</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <div className="text-3xl font-extrabold">
                <CountUp to={allSchools} />
              </div>
              <p className="text-white/60 mt-1">Schools & Colleges</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card">
              <div className="text-3xl font-extrabold">
                <CountUp to={allCities} />
              </div>
              <p className="text-white/60 mt-1">Cities</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ImpactStatsSkeleton() {
  return (
    <section className="py-0">
      <div className="container">
        <div className="h-8 w-64 mx-auto rounded-full bg-white/10 animate-pulse" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
