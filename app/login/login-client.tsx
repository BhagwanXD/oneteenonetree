'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Icon from '@/components/Icon'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getNextPath = (nextValue: string | null) => {
  if (!nextValue) return '/dashboard'
  if (nextValue.startsWith('/') && !nextValue.startsWith('//')) {
    return nextValue
  }
  return '/dashboard'
}

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.35 0 6.35 1.2 8.7 3.2l6.5-6.5C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.7 13.2l7.8 6.1C12.7 13.1 17.9 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.6c-.5 2.7-2.1 5-4.7 6.6l7.3 5.6c4.3-4 7-9.8 7-15.9z"
    />
    <path
      fill="#FBBC05"
      d="M10.5 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6.1C1 15.5 0 19.6 0 23.5c0 3.9 1 8 2.7 11.4l7.8-6.1z"
    />
    <path
      fill="#34A853"
      d="M24 47c6.2 0 11.4-2 15.2-5.6l-7.3-5.6c-2 1.4-4.7 2.2-7.9 2.2-6.1 0-11.3-3.6-13.5-8.8l-7.8 6.1C6.5 42.6 14.6 47 24 47z"
    />
  </svg>
)

export default function LoginClient() {
  const { replace } = useNavigateWithLoader()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [showEmail, setShowEmail] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [otpStatus, setOtpStatus] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)
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
        replace(nextPath)
      }
    })
    return () => {
      mounted = false
    }
  }, [nextPath, replace, supabase])

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
      setOtpError('Unable to send the email right now. Please try again.')
      return
    }

    setOtpSent(true)
    setOtpStatus('Check your email for a sign-in link.')
    setOtpCooldown(60)
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

      <div className="card space-y-6 max-w-xl mx-auto">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busyAction === 'google'}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          aria-label="Continue with Google"
        >
          <GoogleIcon />
          <span>{busyAction === 'google' ? 'Connecting…' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-white/50">
          <div className="h-px flex-1 bg-white/10" />
          <span>OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          {!showEmail ? (
            <button
              type="button"
              onClick={() => setShowEmail(true)}
              className="text-sm text-white/70 hover:text-white transition underline underline-offset-4"
            >
              Continue with email instead
            </button>
          ) : (
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
              <p className="text-xs text-white/50">
                We&apos;ll email you a one-time sign-in link. No password needed.
              </p>
              {otpError ? <div className="text-sm text-red-300">{otpError}</div> : null}
              {otpStatus ? <div className="text-sm text-emerald-200">{otpStatus}</div> : null}
              <button
                type="button"
                onClick={handleOtp}
                disabled={busyAction === 'otp'}
                className="btn w-full justify-center"
              >
                {busyAction === 'otp' ? 'Sending…' : 'Continue'}
              </button>
              {otpSent ? (
                <button
                  type="button"
                  onClick={handleOtp}
                  disabled={otpCooldown > 0 || busyAction === 'otp'}
                  className="text-xs text-white/70 hover:text-white transition"
                >
                  {otpCooldown > 0 ? `Resend link in ${otpCooldown}s` : 'Resend link'}
                </button>
              ) : null}
            </div>
          )}

          <div className="text-xs text-white/60">
            Prefer a password?{' '}
            <Link
              href={`/login/password?next=${encodeURIComponent(nextPath)}`}
              className="text-white/80 hover:text-white transition"
            >
              Sign in with password
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-2 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Icon name="lock" size={16} aria-hidden="true" />
          <span>Secure sign-in powered by Google & email verification.</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="shield" size={16} aria-hidden="true" />
          <span>We never post without permission.</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="eco" size={16} aria-hidden="true" />
          <span>We only use your email for OneTeenOneTree activity.</span>
        </div>
      </div>

      <div className="text-xs text-white/50 text-center">
        By continuing, you agree to the OneTeenOneTree platform terms.
      </div>
    </div>
  )
}
