import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import ContactAdminClient from './contact-admin-client'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Contact Submissions - OneTeenOneTree',
  robots: { index: false, follow: false },
}

export default async function AdminContactPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: rows } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, status, created_at')
    .order('created_at', { ascending: false })

  return <ContactAdminClient initialMessages={rows ?? []} />
}
