'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type ClientState = {
  userId: string | null
  email: string | null
  hasSession: boolean
  event?: string
}

export default function ClientAuthDebug() {
  const supabase = createClientComponentClient()
  const [state, setState] = useState<ClientState>({ userId: null, email: null, hasSession: false })

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const [{ data: userData }, { data: sessionData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.getSession(),
      ])
      if (!mounted) return
      setState({
        userId: userData.user?.id ?? null,
        email: userData.user?.email ?? null,
        hasSession: !!sessionData.session,
      })
    })()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, session) => {
      setState(s => ({
        ...s,
        event: ev,
        userId: session?.user?.id ?? null,
        email: session?.user?.email ?? null,
        hasSession: !!session,
      }))
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [supabase])

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-white/80 text-sm">Client</div>
      <div className="text-white text-sm mt-2 space-y-1">
        <div>userId: <span className="text-white/70">{state.userId ?? 'null'}</span></div>
        <div>email: <span className="text-white/70">{state.email ?? 'null'}</span></div>
        <div>hasSession: <span className="text-white/70">{String(state.hasSession)}</span></div>
        {state.event && <div>lastEvent: <span className="text-white/70">{state.event}</span></div>}
        <div>origin: <span className="text-white/70">{typeof window !== 'undefined' ? window.location.origin : ''}</span></div>
      </div>
    </div>
  )
}

