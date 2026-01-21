import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import GalleryClient from './gallery-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Gallery',
  description:
    'Browse verified OneTeenOneTree plantation drives across cities, student-led events, and community impact photos.',
  path: '/gallery',
})

type GalleryRow = {
  id: string
  image_path: string
  caption: string | null
  city: string | null
  year: number | null
  drive_type: string | null
  tags: string[] | null
  sort_order: number | null
  taken_at: string | null
  created_at: string
}

const resolveImageUrl = (supabase: any, imagePath: string) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  const { data } = supabase.storage.from('gallery').getPublicUrl(imagePath)
  return data?.publicUrl ?? ''
}

export default async function GalleryPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data } = await supabase
    .from('gallery_items')
    .select(
      'id, image_path, caption, city, year, drive_type, tags, sort_order, taken_at, created_at'
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const items = (data ?? []).map((row: GalleryRow) => ({
    ...row,
    image_url: resolveImageUrl(supabase, row.image_path),
  }))
  let showAdminCta = false
  if (items.length === 0) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      showAdminCta = profile?.role === 'admin'
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 hero">
        <div className="container text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">Gallery</h1>
          <p className="text-white/70 text-lg">
            Real moments from OneTeenOneTree drives, student-led impact, and verified plantation
            work across communities.
          </p>
        </div>
      </section>
      <GalleryClient initialItems={items} showAdminCta={showAdminCta} />
      <section className="py-12">
        <div className="container max-w-3xl mx-auto space-y-3 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">About the Gallery</h2>
          <p className="text-white/70 text-base leading-relaxed">
            OneTeenOneTree&apos;s gallery highlights verified plantation drives, student-led
            environmental action, and community partnerships across cities. Every photo represents
            real work in the field, from school drives to local greening initiatives. Follow along
            as we document progress and impact.
          </p>
        </div>
      </section>
    </div>
  )
}
