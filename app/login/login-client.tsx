'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ensureProfile } from '@/lib/auth/profile'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getNextPath = (nextValue: string | null) => {
  if (!nextValue) return '/dashboard'
  if (nextValue.startsWith('/') && !nextValue.startsWith('//')) {
    return nextValue
  }
  return '/dashboard'
}

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [mode, setMode] = useState<'otp' | 'password'>('otp')
  const [otpEmail, setOtpEmail] = useState('')
  const [otpStatus, setOtpStatus] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [passwordEmail, setPasswordEmail] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordStatus, setPasswordStatus] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [busyAction, setBusyAction] = useState<string | null>(null)

  const resetMessage = searchParams?.get('reset') === 'success'

  const nextPath = getNextPath(searchParams?.get('next') || null)

  const redirectTo = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      if (data.user) {
        router.replace(nextPath)
      }
    })
    return () => {
      mounted = false
    }
  }, [nextPath, router, supabase])

  useEffect(() => {
    if (otpCooldown <= 0) return
    const timer = window.setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [otpCooldown])

  const handleGoogle = async () => {
    setBusyAction('google')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo(), queryParams: { prompt: 'select_account' } },
    })
    setBusyAction(null)
  }

  const handleOtp = async () => {
    setOtpError('')
    setOtpStatus('')
    if (!emailPattern.test(otpEmail.trim())) {
      setOtpError('Enter a valid email address.')
      return
    }

    setBusyAction('otp')
    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail.trim(),
      options: { emailRedirectTo: redirectTo() },
    })
    setBusyAction(null)
    if (error) {
      setOtpError('Unable to send the magic link. Please try again.')
      return
    }
    setOtpStatus('Check your email for a sign-in link.')
    setOtpCooldown(60)
  }

  const handlePasswordSignIn = async () => {
    setPasswordError('')
    setPasswordStatus('')
    if (!emailPattern.test(passwordEmail.trim())) {
      setPasswordError('Enter a valid email address.')
      return
    }
    if (!passwordValue) {
      setPasswordError('Enter your password.')
      return
    }
    setBusyAction('signin')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: passwordEmail.trim(),
      password: passwordValue,
    })
    setBusyAction(null)
    if (error) {
      setPasswordError(error.message || 'Unable to sign in.')
      return
    }
    if (data.user) {
      await ensureProfile(supabase, data.user)
    }
    router.replace(nextPath)
  }

  const handlePasswordSignUp = async () => {
    setPasswordError('')
    setPasswordStatus('')
    if (!emailPattern.test(passwordEmail.trim())) {
      setPasswordError('Enter a valid email address.')
      return
    }
    if (passwordValue.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    setBusyAction('signup')
    const { data, error } = await supabase.auth.signUp({
      email: passwordEmail.trim(),
      password: passwordValue,
      options: { emailRedirectTo: redirectTo() },
    })
    setBusyAction(null)
    if (error) {
      setPasswordError(error.message || 'Unable to create account.')
      return
    }
    if (data.user && data.session) {
      await ensureProfile(supabase, data.user)
      router.replace(nextPath)
      return
    }
    setPasswordStatus('Check your email to confirm your account.')
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-white/70">Choose a method to continue.</p>
      </div>

      {resetMessage ? (
        <div className="card text-sm text-emerald-200 text-center">
          Password updated. Sign in with your new password.
        </div>
      ) : null}

      <div className="card space-y-6">
        <div className="space-y-3">
          <button type="button" onClick={handleGoogle} disabled={busyAction === 'google'} className="btn w-full justify-center">
            Continue with Google
          </button>
          <div className="text-center text-xs text-white/50">or</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('otp')}
            className={`px-3 py-2 rounded-xl text-sm transition ${
              mode === 'otp'
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            aria-pressed={mode === 'otp'}
          >
            Email magic link
          </button>
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`px-3 py-2 rounded-xl text-sm transition ${
              mode === 'password'
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            aria-pressed={mode === 'password'}
          >
            Email + password
          </button>
        </div>

        {mode === 'otp' ? (
          <div className="space-y-4">
            <label className="text-sm space-y-2" htmlFor="otp-email">
              <span className="text-white/70">Email address</span>
              <input
                id="otp-email"
                type="email"
                autoComplete="email"
                value={otpEmail}
                onChange={(event) => setOtpEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </label>
            {otpError ? <div className="text-sm text-red-300">{otpError}</div> : null}
            {otpStatus ? <div className="text-sm text-emerald-200">{otpStatus}</div> : null}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOtp}
                disabled={busyAction === 'otp'}
                className="btn"
              >
                {busyAction === 'otp' ? 'Sending…' : 'Send magic link'}
              </button>
              <button
                type="button"
                onClick={handleOtp}
                disabled={otpCooldown > 0 || busyAction === 'otp'}
                className="text-sm text-white/70 hover:text-white transition"
              >
                {otpCooldown > 0 ? `Resend link in ${otpCooldown}s` : 'Resend link'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm space-y-2" htmlFor="password-email">
              <span className="text-white/70">Email address</span>
              <input
                id="password-email"
                type="email"
                autoComplete="email"
                value={passwordEmail}
                onChange={(event) => setPasswordEmail(event.target.value)}
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
                value={passwordValue}
                onChange={(event) => setPasswordValue(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            {passwordError ? <div className="text-sm text-red-300">{passwordError}</div> : null}
            {passwordStatus ? <div className="text-sm text-emerald-200">{passwordStatus}</div> : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePasswordSignIn}
                disabled={busyAction === 'signin'}
                className="btn"
              >
                {busyAction === 'signin' ? 'Signing in…' : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={handlePasswordSignUp}
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
          </div>
        )}
      </div>

      <div className="text-xs text-white/50 text-center">
        By continuing, you agree to the OneTeenOneTree platform terms.
      </div>
    </div>
  )
}
