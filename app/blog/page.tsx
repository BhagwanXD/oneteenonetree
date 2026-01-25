import Image from 'next/image'
import { fetchRssFeed } from '@/lib/rss'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { BookOpen, Users } from 'lucide-react'

export const metadata = {
  title: 'Blog - OneTeenOneTree',
  description:
    'Stories, ideas, and youth-led climate action updates from OneTeenOneTree and Campus Unmuted.',
  openGraph: {
    title: 'Blog - OneTeenOneTree',
    description:
      'Stories, ideas, and youth-led climate action updates from OneTeenOneTree and Campus Unmuted.',
    url: '/blog',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function BlogPage() {
  const feedUrl =
    process.env.CAMPUS_UNMUTED_RSS ||
    'https://campusunmuted.site/rss.xml'

  let items: any[] = []
  try {
    items = await fetchRssFeed(feedUrl)
  } catch (e) {
    // silent fail for MVP
  }

  return (
    <PageShell
      header={
        <PageHeader
          title="Blog"
          description="Stories, ideas, and youth-led climate action updates from OneTeenOneTree and Campus Unmuted."
          icon={<Icon name="article" size={22} aria-hidden="true" />}
        />
      }
    >
      <section className="card text-center max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/brand/campusunmuted-logo.svg"
            alt="Campus Unmuted logo"
            width={90}
            height={90}
            className="rounded-xl bg-white/5 p-3 border border-white/10"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
          <Users size={18} className="text-[var(--acc)]" />
          Campus Unmuted × OneTeenOneTree
        </h2>
        <p className="text-white/70 text-base leading-relaxed">
          Together, <b>OneTeenOneTree</b> and <b>Campus Unmuted</b> empower students
          to share their <i>ideas, stories, and experiences</i> that inspire real
          environmental action. Your words can plant change — just like your trees.
        </p>
        <p className="text-white/60 text-sm">
          Read, write, and raise your voice for a greener future.
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--acc)]" />
            Latest from Campus Unmuted
          </h2>
          <p className="text-white/70 mt-2">
            Curated youth blogs streamed directly from our partner platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.length === 0 && (
            <div className="card">
              Couldn’t load the feed yet. Please check the RSS URL or try again later.
            </div>
          )}

          {items.map((post, idx) => (
            <a
              key={idx}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="card hover:bg-white/10 transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                {post.description && (
                  <p className="text-sm text-white/70 mt-2 line-clamp-3">
                    {post.description}
                  </p>
                )}
              </div>
              <div className="mt-4 text-xs text-white/50">Read on Campus Unmuted</div>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
