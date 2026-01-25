import SmartLink from '@/components/site/SmartLink'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import { Suspense } from 'react'
import ImpactStats, { ImpactStatsSkeleton } from './home/ImpactStats'
import CampusUnmutedSection, { CampusUnmutedSkeleton } from './home/CampusUnmutedSection'

// Revalidate homepage every 5 minutes
export const revalidate = 300
export default function Home() {
  return (
    <PageShell
      useContainer={false}
      innerClassName="space-y-0"
      header={
        <PageHeader
          size="hero"
          containerClassName="max-w-5xl"
          titleClassName="flex flex-wrap items-center justify-center gap-4 text-balance drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          descriptionClassName="max-w-3xl text-white/75"
          title={
            <>
              <span className="relative inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[0_0_28px_rgba(0,208,132,0.35)]">
                <Image
                  src="/logo.png"
                  alt="OneTeenOneTree logo"
                  width={44}
                  height={44}
                  priority
                  sizes="(max-width: 640px) 28px, (max-width: 1024px) 36px, 44px"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 object-contain"
                />
              </span>
              <span className="text-balance">
                OneTeenOneTree = One Tree <span aria-hidden="true">🌿</span>
              </span>
            </>
          }
          description={
            <>
              Take the pledge, plant a tree, inspire your friends.
              <span className="block text-white/70">
                Let&apos;s build a living leaderboard of youth-led climate action.
              </span>
            </>
          }
          actions={
            <>
              <SmartLink href="/pledge" className="btn rounded-full px-6 py-2.5">
                Pledge now
              </SmartLink>
              <SmartLink
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 transition"
              >
                View leaderboard
              </SmartLink>
            </>
          }
        />
      }
    >

      <Suspense fallback={<ImpactStatsSkeleton />}>
        <ImpactStats />
      </Suspense>

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

      <Suspense fallback={<CampusUnmutedSkeleton />}>
        <CampusUnmutedSection />
      </Suspense>

      {/* SDGs — compact grid cards with official UN icons */}
<section className="py-16">
  <div className="container">
    <h2 className="text-4xl md:text-5xl font-semibold text-center">
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
                <SmartLink href="/pledge" className="btn">Take the pledge</SmartLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
