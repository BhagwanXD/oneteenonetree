import SocialClient from './SocialClient'
import { unstable_cache } from 'next/cache'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { createPublicClient } from '@/lib/supabase/public'

export const metadata = buildMetadata({
  title: 'Social',
  description: 'Explore the latest OneTeenOneTree updates across Instagram and LinkedIn.',
  path: '/social',
})

export const revalidate = 180

const getSocialPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('social_posts')
      .select('id, platform, url, title, description, image_url, post_date, created_at')
      .eq('published', true)
      .order('post_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(9)
    return data ?? []
  },
  ['social-posts'],
  { revalidate: 180 }
)

export default async function SocialPage() {
  const data = await getSocialPosts()

  return (
    <PageShell
      header={
        <PageHeader
          title="Social"
          description="Highlights from OneTeenOneTree across Instagram and LinkedIn."
          icon={<Icon name="share" size={22} aria-hidden="true" />}
        />
      }
    >
      <SocialClient initialPosts={data ?? []} />
    </PageShell>
  )
}
