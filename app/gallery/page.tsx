import { unstable_cache } from 'next/cache'
import GalleryClient from './gallery-client'
import { buildMetadata } from '@/lib/seo'
import Icon from '@/components/Icon'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import { Image as ImageIcon } from 'lucide-react'
import { createPublicClient } from '@/lib/supabase/public'

export const metadata = buildMetadata({
  title: 'Gallery',
  description:
    'Browse verified OneTeenOneTree plantation drives across cities, student-led events, and community impact photos and videos.',
  path: '/gallery',
})

export const revalidate = 300

type GalleryRow = {
  id: string
  image_path: string
  media_type?: 'image' | 'video' | null
  caption: string | null
  city: string | null
  year: number | null
  drive_type: string | null
  tags: string[] | null
  sort_order: number | null
  taken_at: string | null
  created_at: string
}

const resolveMediaUrl = (supabase: any, mediaPath: string) => {
  if (!mediaPath) return ''
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath
  }
  const { data } = supabase.storage.from('gallery').getPublicUrl(mediaPath)
  return data?.publicUrl ?? ''
}

const getGalleryItems = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('gallery_items')
      .select(
        'id, image_path, media_type, caption, city, year, drive_type, tags, sort_order, taken_at, created_at'
      )
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    const items = (data ?? []).map((row: GalleryRow) => ({
      ...row,
      media_type: row.media_type ?? 'image',
      media_url: resolveMediaUrl(supabase, row.image_path),
    }))

    return items
  },
  ['gallery-items'],
  { revalidate: 300 }
)

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <PageShell
      header={
        <PageHeader
          title="Gallery"
          description="Real moments from OneTeenOneTree drives, student-led impact, and verified plantation work across communities."
          icon={<Icon name="camera" size={22} aria-hidden="true" />}
        />
      }
    >
      <GalleryClient initialItems={items} />
      <section className="space-y-3 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
          <ImageIcon size={18} className="text-[var(--acc)]" />
          About the Gallery
        </h2>
        <p className="text-white/70 text-base leading-relaxed">
          OneTeenOneTree&apos;s gallery highlights verified plantation drives, student-led
          environmental action, and community partnerships across cities. Every photo represents
          real work in the field, from school drives to local greening initiatives. Follow along
          as we document progress and impact.
        </p>
      </section>
    </PageShell>
  )
}
