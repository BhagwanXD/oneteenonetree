'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordClient() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('')
    setError('')
    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setBusy(true)
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/reset-password')}`
    const { error: submitError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })
    setBusy(false)
    if (submitError) {
      setError('Unable to send reset link. Please try again.')
      return
    }
    setStatus('Check your email to reset your password.')
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <label className="text-sm space-y-2" htmlFor="forgot-email">
        <span className="text-white/70">Email address</span>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          placeholder="you@example.com"
        />
      </label>
      {error ? <div className="text-sm text-red-300">{error}</div> : null}
      {status ? <div className="text-sm text-emerald-200">{status}</div> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn">
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
        <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
