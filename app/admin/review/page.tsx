import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import ReviewClient from './review-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Admin Review - OneTeenOneTree',
  robots: { index: false, follow: false },
}

export default async function AdminReviewPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Check admin (adjust to your schema)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  // Load pending submissions (signed URLs generated client-side)
  const { data: rows } = await supabase
    .from('plantings')
    .select('id,user_id,caption,note,media,status,created_at')
    .eq('status','submitted')
    .order('created_at', { ascending: true })

  return <ReviewClient initialRows={rows ?? []} />
}
