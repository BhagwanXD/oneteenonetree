// app/pledge/success/page.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SuccessClient from './success-client'

export const dynamic = 'force-dynamic'

export default async function PledgeSuccessPage() {
  const supabase = createServerComponentClient({ cookies })

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

  return (
    <SuccessClient
      firstName={firstName}
      totalPledges={totalPledges}
      totalTrees={totalTrees}
    />
  )
}
