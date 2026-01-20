import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

const allowedStatuses = new Set(['new', 'read', 'replied'])

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

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json().catch(() => ({}))
  const id = typeof payload.id === 'string' ? payload.id : ''
  const status = typeof payload.status === 'string' ? payload.status : ''

  if (!id || !allowedStatuses.has(status)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select('id, name, email, phone, subject, message, status, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 400 })
  }

  return NextResponse.json({ message: data })
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })
  const guard = await requireAdmin(supabase)
  if (!guard.ok) return guard.response

  const payload = await req.json().catch(() => ({}))
  const id = typeof payload.id === 'string' ? payload.id : ''
  if (!id) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
