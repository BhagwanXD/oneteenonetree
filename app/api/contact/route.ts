import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

const subjectOptions = new Set([
  'General query',
  'Partnership / CSR',
  'Media / Press',
  'Volunteering',
])

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export async function POST(req: Request) {
  let payload: Record<string, unknown> = {}
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  const name = normalize(payload.name)
  const email = normalize(payload.email)
  const phone = normalize(payload.phone)
  const subject = normalize(payload.subject)
  const message = normalize(payload.message)

  if (!name || !email || !message || !subjectOptions.has(subject)) {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  if (
    name.length > 120 ||
    email.length > 200 ||
    phone.length > 40 ||
    subject.length > 60 ||
    message.length > 2000
  ) {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    phone: phone || null,
    subject,
    message,
    status: 'new',
  })

  if (error) {
    console.error('Contact submission failed', error)
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
