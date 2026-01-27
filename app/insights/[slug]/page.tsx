import { notFound } from 'next/navigation'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, siteUrl } from '@/lib/seo'
import { formatInsightDate, sanitizeInsightHtml, tiptapToMarkdown, wrapInsightTables } from '@/lib/insights'
import ShareBar from './ShareBar'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

const getInsightMeta = (slug: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('insights')
        .select('title,slug,excerpt,meta_title,meta_description,cover_image_url')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
      return data
    },
    ['insight-meta', slug],
    { revalidate: 300, tags: ['insights', `insight-${slug}`] }
  )()

const getInsightBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('insights')
        .select(
          'id,title,slug,excerpt,content,content_md,content_html,content_format,cover_image_url,author_name,tags,category,meta_title,meta_description,published_at,created_at'
        )
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
      return data
    },
    ['insight-detail', slug],
    { revalidate: 300, tags: ['insights', `insight-${slug}`] }
  )()

const getRelatedInsights = (
  category: string,
  currentSlug: string,
  tags: string[]
) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('insights')
        .select('id,title,slug,excerpt,cover_image_url,tags,author_name,published_at,created_at')
        .eq('status', 'published')
        .eq('category', category)
        .neq('slug', currentSlug)
        .limit(12)

      if (!data) return []
      const tagSet = new Set(tags ?? [])
      return data
        .map((item) => {
          const overlap = (item.tags ?? []).filter((tag) => tagSet.has(tag)).length
          return { ...item, overlap }
        })
        .sort((a, b) => {
          if (b.overlap !== a.overlap) return b.overlap - a.overlap
          const dateA = new Date(a.published_at || a.created_at).getTime()
          const dateB = new Date(b.published_at || b.created_at).getTime()
          return dateB - dateA
        })
        .slice(0, 6)
    },
    ['related-insights', category, currentSlug],
    { revalidate: 300, tags: ['insights', `insight-${currentSlug}`] }
  )()

async function RelatedInsights({
  currentSlug,
  category,
  tags,
}: {
  currentSlug: string
  category: string | null
  tags: string[]
}) {
  if (!category) {
    return (
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">More insights</h2>
        <p className="text-white/70">
          Explore more field notes and student-led climate action updates.
        </p>
        <a href="/insights" className="btn inline-flex justify-center">
          Back to all insights
        </a>
      </section>
    )
  }

  const related = await getRelatedInsights(category, currentSlug, tags)

  if (!related.length) {
    return (
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">More insights</h2>
        <p className="text-white/70">
          Explore more field notes and student-led climate action updates.
        </p>
        <a href="/insights" className="btn inline-flex justify-center">
          Back to all insights
        </a>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Related insights</h2>
        <p className="text-white/70">
          Keep reading more insights in this category.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {related.map((insight) => (
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
                {formatInsightDate(insight.published_at || insight.created_at)}
                {insight.author_name ? ` • ${insight.author_name}` : ''}
              </div>
              <h3 className="text-lg font-semibold">{insight.title}</h3>
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
            <a href={`/insights/${insight.slug}`} className="btn mt-4 justify-center">
              Read insight
            </a>
          </article>
        ))}
      </div>
      <div className="text-center">
        <a href="/insights" className="btn inline-flex justify-center">
          Back to all insights
        </a>
      </div>
    </section>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const data = await getInsightMeta(slug)

  if (!data) {
    return buildMetadata({
      title: 'Insight not found',
      description: 'This insight could not be found.',
      path: `/insights/${slug}`,
      noIndex: true,
    })
  }

  const title = data.meta_title || data.title
  const description = data.meta_description || data.excerpt || undefined

  return buildMetadata({
    title,
    description,
    path: `/insights/${data.slug}`,
    image: data.cover_image_url ?? undefined,
  })
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getInsightBySlug(slug)

  if (!data) notFound()

  const dateLabel = formatInsightDate(data.published_at || data.created_at)
  const contentFormat = data.content_format || (data.content_html ? 'html' : 'md')
  const htmlBody =
    contentFormat === 'html' && data.content_html
      ? wrapInsightTables(sanitizeInsightHtml(data.content_html))
      : ''
  const markdownBody =
    contentFormat !== 'html'
      ? (typeof data.content_md === 'string' && data.content_md.trim()) ||
        tiptapToMarkdown(data.content) ||
        ''
      : ''
  const pageUrl = `${siteUrl}/insights/${data.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
      '@type': 'BlogPosting',
    headline: data.title,
    datePublished: data.published_at || data.created_at,
    dateModified: data.published_at || data.created_at,
    author: data.author_name
      ? { '@type': 'Person', name: data.author_name }
      : { '@type': 'Organization', name: 'OneTeenOneTree' },
    image: data.cover_image_url ? [data.cover_image_url] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OneTeenOneTree',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  }

  return (
    <PageShell
      innerClassName="mt-6 space-y-8"
      header={
        <PageHeader
          title={data.title}
          description={data.excerpt || 'An insight from the OneTeenOneTree team.'}
          icon={<Icon name="article" size={22} aria-hidden="true" />}
          containerClassName="py-8 md:py-10"
        />
      }
    >
      <JsonLd data={jsonLd} id={`insight-jsonld-${data.id}`} />

      <article className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
          <span>{dateLabel}</span>
          {data.author_name ? <span>• {data.author_name}</span> : null}
        </div>

        {data.tags?.length ? (
          <div className="flex flex-wrap justify-center gap-2">
            {(data.tags as string[]).map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider rounded-full border border-white/10 px-3 py-1 text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <ShareBar title={data.title} url={pageUrl} />

        {data.cover_image_url ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src={data.cover_image_url}
              alt={`Cover for ${data.title}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : null}

        {htmlBody ? (
          <div className="insights-prose" dangerouslySetInnerHTML={{ __html: htmlBody }} />
        ) : markdownBody ? (
          <div className="insights-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className="table-wrap">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {markdownBody}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-white/70">
            This insight is being updated. Please check back soon.
          </p>
        )}
      </article>

      <RelatedInsights currentSlug={data.slug} category={data.category ?? null} tags={data.tags ?? []} />
    </PageShell>
  )
}
