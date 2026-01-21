import { pressItems } from '@/data/press'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Press',
  description:
    'News, announcements, and media resources for the OneTeenOneTree youth-led climate movement.',
  path: '/press',
})

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
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold">Press & Media</h1>
            <p className="text-white/70 mt-3 text-lg">
              News, announcements, and resources for journalists covering OneTeenOneTree.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">In the News</h2>
          </div>

          {pressItems.length === 0 ? (
            <div className="mt-8 text-center text-white/60">
              Press coverage coming soon.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pressItems.map((item) => (
                <article key={item.title} className="card space-y-3">
                  <div className="text-sm text-white/60">
                    {item.source} • {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-white hover:text-[var(--acc)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                  >
                    {item.title}
                  </a>
                  {item.summary && <p className="text-sm text-white/70">{item.summary}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Media Kit</h2>
            <p className="text-white/70 mt-2">
              Download official assets and quick facts for coverage and partnerships.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="card text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">Contact for Media</h2>
            <p className="text-white/70">
              For media inquiries, reach out via our contact page.
            </p>
            <a href="mailto:support@oneteenonetree.org" className="btn justify-center">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
