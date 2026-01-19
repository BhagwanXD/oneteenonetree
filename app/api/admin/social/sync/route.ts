import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { syncInstagram, syncLinkedIn } from '@/lib/social/sync'

export const runtime = 'nodejs'

const requireAdmin = async (supabase: ReturnType<typeof createRouteHandlerClient>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const role = (profile as { role?: string | null } | null)?.role
  if (role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true }
}

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const [instagram, linkedin] = await Promise.all([
    syncInstagram(supabase),
    syncLinkedIn(supabase),
  ])

  return NextResponse.json({ instagram, linkedin })
}
