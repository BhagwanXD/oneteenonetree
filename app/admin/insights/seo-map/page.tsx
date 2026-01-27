import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SeoMapClient from './seo-map-client'

export const metadata = {
  title: 'Admin — Insights SEO Map | OneTeenOneTree',
}

export default async function InsightsSeoMapPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('insight_links_map')
    .select('category,pillar_slug,cluster_slugs,action_type,anchor_variants')
    .order('category', { ascending: true })

  return <SeoMapClient initialRows={data ?? []} />
}
