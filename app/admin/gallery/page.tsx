import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import GalleryAdminClient from './gallery-admin-client'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Gallery Manager - OneTeenOneTree',
  robots: { index: false, follow: false },
}

type GalleryRow = {
  id: string
  image_path: string
  media_type?: 'image' | 'video' | null
  video_muted?: boolean | null
  caption: string | null
  city: string | null
  year: number | null
  drive_type: string | null
  is_published: boolean
  sort_order: number | null
  taken_at: string | null
  created_at: string
}

export default async function AdminGalleryPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('gallery_items')
    .select(
      'id, image_path, media_type, video_muted, caption, city, year, drive_type, is_published, sort_order, taken_at, created_at'
    )
    .order('created_at', { ascending: false })

  return <GalleryAdminClient initialItems={(data as GalleryRow[]) ?? []} />
}
