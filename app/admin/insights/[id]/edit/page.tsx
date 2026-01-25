import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import InsightEditorClient from '../../InsightEditorClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Admin — Edit Insight | OneTeenOneTree',
}

export default async function AdminInsightEditPage({ params }: PageProps) {
  const { id } = await params
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

  const { data: insight } = await supabase
    .from('insights')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!insight) redirect('/admin/insights')

  return <InsightEditorClient initialInsight={insight} defaultAuthorName={profile?.name ?? null} />
}
