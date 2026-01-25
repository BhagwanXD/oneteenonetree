import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, siteUrl } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { Sparkles, Target, ArrowRightCircle } from 'lucide-react'

export const metadata = buildMetadata({
  title: 'Mission',
  description:
    'OneTeenOneTree is a youth-led climate action movement in India turning pledges into verified tree plantations through community-driven drives.',
  path: '/mission',
})

const missionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/mission#webpage`,
  url: `${siteUrl}/mission`,
  name: 'Mission - OneTeenOneTree',
  description:
    'OneTeenOneTree is a youth-led climate action movement in India turning pledges into verified tree plantations through community-driven drives.',
  inLanguage: 'en-IN',
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': `${siteUrl}/#organization` },
}

export default function MissionPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Our Mission"
          description="OneTeenOneTree is youth-led, focused on turning climate intent into verified, on-ground tree plantations across India."
          icon={<Icon name="eco" size={22} aria-hidden="true" />}
        />
      }
    >
      <JsonLd data={missionJsonLd} id="mission-jsonld" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Target size={18} className="text-[var(--acc)]" />
            Pledge → Plant → Verify → Showcase
          </h2>
          <p className="text-white/70">
            Our method keeps impact honest and transparent, while helping students build a lifelong habit of
            climate action.
          </p>
          <ol className="space-y-3 text-white/70">
            <li>
              <span className="text-white font-semibold">1. Pledge</span> — commit to planting and caring for a
              tree.
            </li>
            <li>
              <span className="text-white font-semibold">2. Plant</span> — choose a native sapling and plant it in
              your community.
            </li>
            <li>
              <span className="text-white font-semibold">3. Verify</span> — share evidence so every tree is real and
              counted.
            </li>
            <li>
              <span className="text-white font-semibold">4. Showcase</span> — inspire others through stories,
              galleries, and leaderboards.
            </li>
          </ol>
        </div>

        <div className="card space-y-4">
          <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--acc)]" />
            What makes us different
          </h2>
          <ul className="space-y-3 text-white/70">
            <li>
              <span className="text-white font-semibold">Verified impact</span> — proof-based submissions and
              reviews.
            </li>
            <li>
              <span className="text-white font-semibold">Student leadership</span> — chapters led by teens in
              schools and colleges.
            </li>
            <li>
              <span className="text-white font-semibold">Local biodiversity</span> — focus on native species and
              long-term care.
            </li>
            <li>
              <span className="text-white font-semibold">Community storytelling</span> — sharing wins to grow the
              movement.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="card flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
              <ArrowRightCircle size={18} className="text-[var(--acc)]" />
              Ready to take action?
            </h2>
            <p className="text-white/70 mt-2">
              Start with a pledge, join a verified drive, and see your impact in the gallery.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pledge" className="btn">
              Take the pledge
            </Link>
            <Link href="/plant" className="btn">
              Submit a planting
            </Link>
            <Link href="/gallery" className="btn">
              View the gallery
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
