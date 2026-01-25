// app/pledge/success/page.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SuccessClient from './success-client'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Pledge Success - OneTeenOneTree',
  robots: { index: false, follow: false },
}

export default async function PledgeSuccessPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let firstName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()
    firstName = profile?.name?.split(' ')?.[0] ?? null
  }

  const { data: rows } = await supabase.from('pledges').select('trees')
  const rowsArr = rows ?? []
  const totalPledges = rowsArr.length
  const totalTrees = rowsArr.reduce((a, b) => a + (Number(b.trees) || 0), 0)

  const headline = `Thank you ${firstName ? `${firstName}!` : 'friend!'}`

  return (
    <PageShell
      header={
        <PageHeader
          title={headline}
          description="Your pledge has been recorded — share it and keep the momentum going."
          icon={<Icon name="award" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <SuccessClient totalPledges={totalPledges} totalTrees={totalTrees} />
      </Reveal>
    </PageShell>
  )
}
