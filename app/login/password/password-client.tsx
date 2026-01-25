'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ensureProfile } from '@/lib/auth/profile'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getNextPath = (nextValue: string | null) => {
  if (!nextValue) return '/dashboard'
  if (nextValue.startsWith('/') && !nextValue.startsWith('//')) {
    return nextValue
  }
  return '/dashboard'
}

export default function PasswordLoginClient() {
  const { replace } = useNavigateWithLoader()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState<string | null>(null)

  const nextPath = getNextPath(searchParams?.get('next') || null)
  const redirectTo = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      if (data.user) {
        replace(nextPath)
      }
    })
    return () => {
      mounted = false
    }
  }, [nextPath, replace, supabase])

  const handleSignIn = async () => {
    setError('')
    setStatus('')
    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }

    setBusyAction('signin')
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusyAction(null)
    if (signInError) {
      setError(signInError.message || 'Unable to sign in.')
      return
    }
    if (data.user) {
      await ensureProfile(supabase, data.user)
    }
    replace(nextPath)
  }

  const handleSignUp = async () => {
    setError('')
    setStatus('')
    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setBusyAction('signup')
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: redirectTo() },
    })
    setBusyAction(null)
    if (signUpError) {
      setError(signUpError.message || 'Unable to create account.')
      return
    }

    if (data.user && data.session) {
      await ensureProfile(supabase, data.user)
      replace(nextPath)
      return
    }

    setStatus('Check your email to confirm your account.')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign in with password</h1>
        <p className="text-white/70">Use your email and password to continue.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSignIn()
        }}
        className="card space-y-4"
      >
        <label className="text-sm space-y-2" htmlFor="password-email">
          <span className="text-white/70">Email address</span>
          <input
            id="password-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="text-sm space-y-2" htmlFor="password-value">
          <span className="text-white/70">Password</span>
          <input
            id="password-value"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        {error ? <div className="text-sm text-red-300">{error}</div> : null}
        {status ? <div className="text-sm text-emerald-200">{status}</div> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busyAction === 'signin'} className="btn">
            {busyAction === 'signin' ? 'Signing in…' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={busyAction === 'signup'}
            className="btn"
          >
            {busyAction === 'signup' ? 'Creating…' : 'Create account'}
          </button>
          <Link
            href="/forgot-password"
            className="text-sm text-white/70 hover:text-white transition self-center"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="text-sm text-white/60">
        Prefer an email link instead?{' '}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="text-white/80 hover:text-white transition"
        >
          Go back
        </Link>
      </div>
    </div>
  )
}
