import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { buildMetadata } from '@/lib/seo'
import { formatInsightDate } from '@/lib/insights'
import { createPublicClient } from '@/lib/supabase/public'

export const metadata = buildMetadata({
  title: 'Insights',
  description:
    'Read insights from OneTeenOneTree on youth-led climate action, verified tree plantation drives, and community impact in India.',
  path: '/insights',
})

export const revalidate = 300

type InsightCard = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  author_name: string | null
  tags: string[] | null
  published_at: string | null
  created_at: string
}

const getInsights = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('insights')
      .select('id,title,slug,excerpt,cover_image_url,author_name,tags,published_at,created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    return (data ?? []) as InsightCard[]
  },
  ['insights-list'],
  { revalidate: 300 }
)

export default async function InsightsPage() {
  const insights = await getInsights()

  return (
    <PageShell
      header={
        <PageHeader
          title="Insights"
          description="Fresh perspectives from OneTeenOneTree on youth-led climate action, verified plantations, and community impact."
          icon={<Icon name="article" size={22} aria-hidden="true" />}
        />
      }
    >
      <section className="space-y-6">
        {insights.length === 0 ? (
          <div className="card text-center max-w-xl mx-auto space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70">
              <Icon name="info" size={20} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">No insights yet.</h2>
            <p className="text-white/70">
              We&apos;re preparing our first articles. Check back soon for updates from the team.
            </p>
            <Link href="/contact" className="btn justify-center">
              Contact the team
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => {
              const dateLabel = formatInsightDate(insight.published_at || insight.created_at)
              return (
                <article key={insight.id} className="card flex flex-col">
                  {insight.cover_image_url ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 mb-4">
                      <img
                        src={insight.cover_image_url}
                        alt={`Cover for ${insight.title}`}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-3 flex-1">
                    <div className="text-xs text-white/50">
                      {dateLabel}
                      {insight.author_name ? ` • ${insight.author_name}` : ''}
                    </div>
                    <h2 className="text-xl font-semibold">{insight.title}</h2>
                    <p className="text-sm text-white/70">
                      {insight.excerpt || 'Read the latest insight from the OneTeenOneTree team.'}
                    </p>
                    {insight.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {insight.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs uppercase tracking-wider rounded-full border border-white/10 px-3 py-1 text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Link href={`/insights/${insight.slug}`} className="btn mt-4 justify-center">
                    Read insight
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold">Why we publish insights</h2>
        <p className="text-white/70">
          OneTeenOneTree shares field learnings, student stories, and verified climate action updates to help
          schools, volunteers, and communities turn pledges into lasting impact.
        </p>
      </section>
    </PageShell>
  )
}
