import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'
import { pressItems } from '@/data/press'
import { buildMetadata, siteUrl } from '@/lib/seo'
import Icon from '@/components/Icon'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import { Newspaper, Package, Mail } from 'lucide-react'

export const metadata = buildMetadata({
  title: 'Press',
  description:
    'News, announcements, and media resources for OneTeenOneTree, the youth-led climate action movement in India.',
  path: '/press',
})

const pressJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/press#webpage`,
  url: `${siteUrl}/press`,
  name: 'Press - OneTeenOneTree',
  description:
    'Press resources and media updates for OneTeenOneTree, a youth-led climate action movement in India.',
  inLanguage: 'en-IN',
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': `${siteUrl}/#organization` },
}

const mediaKitItems = [
  {
    name: 'Logo Pack',
    file: '/media-kit/logo-pack.zip',
    description: 'Official logo files in multiple formats.',
  },
  {
    name: 'Brand Colors',
    file: '/media-kit/brand-colors.pdf',
    description: 'Primary and secondary color palette.',
  },
  {
    name: 'One-Pager',
    file: '/media-kit/one-pager.pdf',
    description: 'Overview of the mission, impact, and programs.',
  },
]

export default function PressPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Press & Media"
          description="OneTeenOneTree is youth-led — find resources for journalists covering our verified tree plantation drives in India."
          icon={<Icon name="info" size={22} aria-hidden="true" />}
        />
      }
    >
      <JsonLd data={pressJsonLd} id="press-jsonld" />

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            <Newspaper size={18} className="text-[var(--acc)]" />
            In the News
          </h2>
        </div>

        {pressItems.length === 0 ? (
          <div className="text-center text-white/60 space-y-2">
            <div className="text-xl font-semibold text-white">We’re just getting started</div>
            <p>
              Our first stories are on the way. For interviews, impact notes, or collaboration ideas, reach out
              directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressItems.map((item) => (
              <article key={item.title} className="card space-y-3">
                <div className="text-sm text-white/60">
                  {item.source} •{' '}
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white hover:text-[var(--acc)] transition inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                >
                  {item.title}
                  <Icon name="externalLink" size={16} aria-hidden="true" />
                </a>
                {item.summary && <p className="text-sm text-white/70">{item.summary}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            <Package size={18} className="text-[var(--acc)]" />
            Media Kit
          </h2>
          <p className="text-white/70 mt-2">
            Download official assets and quick facts for coverage and partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaKitItems.map((item) => (
            <div key={item.file} className="card space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-white/60 mt-1">{item.description}</p>
              </div>
              <a href={item.file} download className="btn justify-center">
                Download
              </a>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-center text-white/60">
          <img src="/logo.png" alt="OneTeenOneTree logo for press kit" className="w-20 h-20 object-contain" />
          <p>Need a different format or co-branding guidance? Ask for the full press kit.</p>
        </div>
      </section>

      <section>
        <div className="card text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            <Mail size={18} className="text-[var(--acc)]" />
            Contact for Media
          </h2>
          <p className="text-white/70">
            For media inquiries, interviews, or partnerships, reach out via our contact page.
          </p>
          <Link href="/contact" className="btn justify-center">
            Contact us
          </Link>
        </div>
      </section>

    </PageShell>
  )
}
