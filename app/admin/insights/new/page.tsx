import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import InsightEditorClient from '../InsightEditorClient'

export const metadata = {
  title: 'Admin — New Insight | OneTeenOneTree',
}

export default async function AdminInsightNewPage() {
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

  return <InsightEditorClient defaultAuthorName={profile?.name ?? null} />
}
