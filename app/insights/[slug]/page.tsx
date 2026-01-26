import { notFound } from 'next/navigation'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, siteUrl } from '@/lib/seo'
import { formatInsightDate, renderInsightContent } from '@/lib/insights'
import ShareBar from './ShareBar'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

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
    { revalidate: 300 }
  )()

const getInsightBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('insights')
        .select(
          'id,title,slug,excerpt,content,cover_image_url,author_name,tags,meta_title,meta_description,published_at,created_at'
        )
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
      return data
    },
    ['insight-detail', slug],
    { revalidate: 300 }
  )()

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
  const contentHtml = renderInsightContent(data.content)
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

        {contentHtml ? (
          <div
            className="insights-prose"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <p className="text-white/70">
            This insight is being updated. Please check back soon.
          </p>
        )}
      </article>

      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">More insights</h2>
        <p className="text-white/70">
          Explore more field notes and student-led climate action updates.
        </p>
        <a href="/insights" className="btn inline-flex justify-center">
          Back to all insights
        </a>
      </section>
    </PageShell>
  )
}
