import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, siteUrl } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { BarChart3, Camera, Share2, Sprout } from 'lucide-react'

export const metadata = buildMetadata({
  title: 'Impact',
  description:
    'See the verified impact of OneTeenOneTree, a youth-led climate action movement in India turning pledges into real trees.',
  path: '/impact',
})

const impactJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'OneTeenOneTree',
      url: siteUrl,
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/impact#webpage`,
      url: `${siteUrl}/impact`,
      name: 'Impact - OneTeenOneTree',
      description:
        'See the verified impact of OneTeenOneTree, a youth-led climate action movement in India turning pledges into real trees.',
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
    },
  ],
}

export default function ImpactPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Impact"
          description="OneTeenOneTree is youth-led, and we measure impact through verified plantations, student participation, and transparent proof."
          icon={<Icon name="award" size={22} aria-hidden="true" />}
        />
      }
    >
      <JsonLd data={impactJsonLd} id="impact-jsonld" />

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            <BarChart3 size={18} className="text-[var(--acc)]" />
            Impact at a glance
          </h2>
          <p className="text-white/60 mt-2">
            These numbers grow as more verified drives come online.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Verified Trees', value: 'Growing' },
            { label: 'Active Schools', value: 'Growing' },
            { label: 'Cities & Districts', value: 'Growing' },
            { label: 'Student Stories', value: 'Growing' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl font-bold text-[var(--acc)]">{stat.value}</div>
              <div className="text-white/60 mt-2 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Camera size={18} className="text-[var(--acc)]" />
            Proof-first gallery
          </h2>
          <p className="text-white/70">
            Browse verified plantations, student stories, and on-ground drives to see the movement in action.
          </p>
          <Link href="/gallery" className="btn">
            View the gallery
          </Link>
        </div>
        <div className="card space-y-3">
          <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Share2 size={18} className="text-[var(--acc)]" />
            Share impact publicly
          </h2>
          <p className="text-white/70">
            We highlight verified stories on social channels to inspire new schools and volunteers.
          </p>
          <Link href="/social" className="btn">
            Explore social updates
          </Link>
        </div>
      </section>

      <section>
        <div className="card flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold inline-flex items-center gap-2">
              <Sprout size={18} className="text-[var(--acc)]" />
              Add your tree to the impact map
            </h2>
            <p className="text-white/70 mt-2">
              Make a pledge, plant a tree, and submit verification to strengthen the record.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pledge" className="btn">
              Take the pledge
            </Link>
            <Link href="/plant" className="btn">
              Submit proof
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
