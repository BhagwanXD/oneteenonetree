import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'
 
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { fetchRssFeed } from '@/lib/rss'

// Revalidate homepage every 5 minutes
export const revalidate = 300

type Pledge = {
  trees: number | null
  school: string | null
  city: string | null
  state: string | null
  country: string | null
}

// ---- Helpers ---------------------------------------------------------------


async function getPledges() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const { data, error } = await supabase
    .from('pledges')
    .select('trees,school,city,state,country')

  if (error) {
    console.error('[pledges]', error.message)
    return [] as Pledge[]
  }
  return (data ?? []) as Pledge[]
}

async function getLeaderboard() {
  // If tsconfig has "resolveJsonModule": true, you can import json directly.
  // Works fine in Next 14/15 in the app router:
  const mod = await import('@/data/leaderboard.json')
  return (mod.default ?? mod) as {
    name?: string
    trees?: number
    school?: string
    city?: string
    state?: string
    country?: string
  }[]
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr.filter(Boolean)))
}

function sumTrees(arr: { trees?: number | null }[]) {
  return arr.reduce((a, b) => a + (Number(b.trees) || 0), 0)
}

// ---- Page ------------------------------------------------------------------

// ---- Page ------------------------------------------------------------------

export default async function Home() {
  // data sources
  const [pledges, leaderboard] = await Promise.all([getPledges(), getLeaderboard()])

  // stats
  const totalPledges = pledges.length
  const verifiedTrees = sumTrees(leaderboard) // verified = from leaderboard only
  const allSchools = uniq([
    ...pledges.map((p) => (p.school ?? '').trim()),
    ...leaderboard.map((l) => (l.school ?? '').trim()),
  ]).length
  const allCities = uniq([
    ...pledges.map((p) => [p.city, p.state, p.country].filter(Boolean).join(', ').trim()),
    ...leaderboard.map((l) => [l.city, l.state, l.country].filter(Boolean).join(', ').trim()),
  ]).filter(Boolean).length

  const cuItems = await (async () => {
    try {
      return await fetchRssFeed(process.env.CAMPUS_UNMUTED_RSS || 'https://campusunmuted.site/rss.xml')
    } catch {
      return [] as { title: string; link: string; description?: string }[]
    }
  })()

  return (
    <>
      {/* Full-bleed hero with animated CTAs */}
      <section className="bleed hero py-16 md:py-24">
        <div className="container text-center">
          <Reveal>
            <Reveal>
  <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
    <Image
      src="/logo.png"
      alt="OneTeenOneTree Logo"
      width={60}
      height={60}
      className="rounded-xl md:w-[70px] md:h-[70px] w-[50px] h-[50px] object-contain"
      priority
    />
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center">
      OneTeenOneTree = One Tree <span className="text-[var(--acc)]">🌱</span>
    </h1>
  </div>
</Reveal>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/80 mt-4 text-lg max-w-3xl mx-auto">
              Take the pledge, plant a tree, inspire your friends. Let’s build a living leaderboard of youth-led climate action.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/pledge" className="btn">Pledge now</Link>
              <Link href="/leaderboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/15 hover:bg-white/5 transition">
                View leaderboard
              </Link>
            </div>
          </Reveal>

          
        </div>
      </section>

      {/* Impact counters (now real) */}
      <section className="py-0">
        <div className="container">
          <Reveal>
            <h2 className="text-3xl font-bold text-center">Real impact, growing daily</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Reveal>
              <div className="card">
                <div className="text-3xl font-extrabold"><CountUp to={totalPledges} /></div>
                <p className="text-white/60 mt-1">Pledges</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card">
                <div className="text-3xl font-extrabold"><CountUp to={verifiedTrees} /></div>
                <p className="text-white/60 mt-1">Verified Trees</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card">
                <div className="text-3xl font-extrabold"><CountUp to={allSchools} /></div>
                <p className="text-white/60 mt-1">Schools & Colleges</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card">
                <div className="text-3xl font-extrabold"><CountUp to={allCities} /></div>
                <p className="text-white/60 mt-1">Cities</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

     {/* HOW IT WORKS — clean emoji version */}
<section className="py-16">
  <div className="container">
    <h2 className="text-3xl md:text-4xl font-bold text-center">How it works</h2>
    <p className="text-white/70 text-center mt-2 max-w-2xl mx-auto">
      Simple steps to turn your pledge into real-world change.
    </p>

    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { emoji: '📝', title: 'Pledge', desc: 'Sign in with Google and take your pledge.' },
        { emoji: '🌱', title: 'Plant', desc: 'Choose a native sapling and plant it safely.' },
        { emoji: '📸', title: 'Prove', desc: 'Upload a photo and earn badges & certificates.' },
        { emoji: '💚', title: 'Inspire', desc: 'Motivate others and climb the leaderboard.' },
      ].map((step, i) => (
        <div
          key={i}
          className="card text-center hover:bg-white/[0.07] transition rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <div className="text-5xl mb-3">{step.emoji}</div>
          <h3 className="text-xl font-semibold">{step.title}</h3>
          <p className="text-white/70 text-sm mt-2 max-w-xs">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Campus Unmuted partnership + live posts */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">From Campus Unmuted</h2>
            <p className="text-white/70 mt-3">
              <b>OneTeenOneTree</b> has partnered with <b>Campus Unmuted</b> to
              bring authentic <i>student voices</i> to the movement—read, write, and be heard.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
            {/* Brand column */}
            <div className="text-center lg:text-left">
              <Image
                src="/brand/campusunmuted-logo.svg" alt="Campus Unmuted"
                width={180} height={180}
                className="mx-auto lg:mx-0 rounded-2xl border border-white/10 bg-white/5 p-5"
              />
              <ul className="text-sm text-white/70 mt-5 space-y-2">
                <li>🌍 Global student voices</li>
                <li>✍️ Easy, fast publishing</li>
                <li>🚀 Amplify impact with stories</li>
              </ul>
              <a
                href="https://www.campusunmuted.site" target="_blank" rel="noreferrer"
                className="inline-flex mt-5 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition"
              >
                Visit Campus Unmuted →
              </a>
            </div>

            {/* Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(cuItems?.slice(0,3) ?? []).map((post:any, i:number) => (
                <a key={i} href={post.link} target="_blank" rel="noreferrer"
                   className="group rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition flex flex-col">
                  {/* Optional cover in future */}
                  <div className="p-5 flex-1">
                    <h3 className="font-semibold group-hover:text-[var(--acc)] line-clamp-2">{post.title}</h3>
                    {post.description && (
                      <p className="text-white/70 text-sm mt-2 line-clamp-3">{post.description}</p>
                    )}
                  </div>
                  <div className="px-5 py-3 text-xs text-white/50 border-t border-white/10 flex items-center gap-2">
                    <Image src="/brand/campusunmuted-mark.svg" alt="" width={16} height={16} />
                    campusunmuted.site →
                  </div>
                </a>
              ))}
              {(!cuItems || cuItems.length === 0) && (
                [1,2,3].map(i => <div key={i} className="rounded-2xl h-44 bg-white/5 animate-pulse" />)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SDGs — compact grid cards with official UN icons */}
<section className="py-16">
  <div className="container">
    <h2 className="text-4xl md:text-5xl font-extrabold text-center">
      Aligned with the UN SDGs
    </h2>
    <p className="text-white/70 text-lg text-center mt-3">
      OneTeenOneTree advances global goals through youth-led, local action.
    </p>

    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {[
        { n: 6,  title: 'SDG 6 — Clean Water & Sanitation',  blurb: 'Tree cover safeguards watersheds and improves infiltration.' },
        { n: 7,  title: 'SDG 7 — Affordable & Clean Energy', blurb: 'Shade reduces cooling demand; we promote clean, efficient campuses.' },
        { n: 11, title: 'SDG 11 — Sustainable Cities',       blurb: 'Urban trees = cooler streets, healthier, more resilient cities.' },
        { n: 12, title: 'SDG 12 — Responsible Consumption',  blurb: 'Native planting, composting and low-waste drives at schools.' },
        { n: 13, title: 'SDG 13 — Climate Action',           blurb: 'Tree planting + care as community resilience and awareness.' },
        { n: 15, title: 'SDG 15 — Life on Land',             blurb: 'Native species, biodiversity, soil & water protection.' },
        { n: 17, title: 'SDG 17 — Partnerships',             blurb: 'Schools, youth orgs, city chapters, and platforms like Campus Unmuted.' },
      ].map(g => {
        const num = String(g.n).padStart(2, '0');
        const icon = `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${num}.jpg`;
        return (
          <a
            key={g.n}
            href={`https://sdgs.un.org/goals/goal${g.n}`}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex gap-3 items-start hover:bg-white/[0.08] transition"
          >
            <div className="shrink-0 w-[70px] h-[70px] rounded-lg overflow-hidden bg-white/10">
              <Image
                src={icon}
                alt={`SDG ${g.n} icon`}
                width={70}
                height={70}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-semibold group-hover:text-[var(--acc)] leading-tight">
                {g.title}
              </h3>
              <p className="text-white/70 text-sm mt-1 leading-snug">
                {g.blurb}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <Reveal>
            <div className="card text-center">
              <h3 className="text-2xl md:text-3xl font-bold">Ready to plant your first tree?</h3>
              <p className="text-white/70 mt-2">Join thousands of students making a real-world impact.</p>
              <div className="mt-5">
                <Link href="/pledge" className="btn">Take the pledge</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
