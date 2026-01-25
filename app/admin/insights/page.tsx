import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import InsightsAdminClient from './insights-admin-client'

export const metadata = {
  title: 'Admin — Insights | OneTeenOneTree',
}

export default async function AdminInsightsPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,name')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('insights')
    .select('id,title,slug,status,published_at,updated_at,created_at')
    .order('updated_at', { ascending: false })

  return <InsightsAdminClient initialInsights={data ?? []} />
}
