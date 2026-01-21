import { Suspense } from 'react'
import PasswordLoginClient from './password-client'

export const metadata = {
  title: 'Password sign in | OneTeenOneTree',
  description: 'Sign in to OneTeenOneTree using email and password.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/login/password',
  },
  robots: { index: false, follow: false },
}

export default function PasswordLoginPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <Suspense fallback={<div className="text-sm text-white/60">Loading…</div>}>
        <PasswordLoginClient />
      </Suspense>
    </div>
  )
}
