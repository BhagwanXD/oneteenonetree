import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SocialAdminClient from './social-admin-client'

export default async function AdminSocialPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data: rows } = await supabase
    .from('social_posts')
    .select(
      'id, platform, url, title, description, image_url, post_date, created_at, published, source'
    )
    .order('created_at', { ascending: false })

  return <SocialAdminClient initialPosts={rows ?? []} />
}
