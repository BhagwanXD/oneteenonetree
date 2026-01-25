'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'

export default function ResetPasswordClient() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const { replace } = useNavigateWithLoader()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setReady(true)
      if (!data.user) {
        setError('Reset link expired. Please request a new one.')
      }
    })
    return () => {
      mounted = false
    }
  }, [supabase])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('')
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (updateError) {
      setError(updateError.message || 'Unable to update password.')
      return
    }
    setStatus('Password updated.')
    replace('/login?reset=success')
  }

  if (!ready) {
    return <div className="text-sm text-white/60">Loading…</div>
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <label className="text-sm space-y-2" htmlFor="reset-password">
        <span className="text-white/70">New password</span>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
        />
      </label>
      <label className="text-sm space-y-2" htmlFor="reset-confirm">
        <span className="text-white/70">Confirm password</span>
        <input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
        />
      </label>
      {error ? <div className="text-sm text-red-300">{error}</div> : null}
      {status ? <div className="text-sm text-emerald-200">{status}</div> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn">
          {busy ? 'Updating…' : 'Update password'}
        </button>
        <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
