import { Suspense } from 'react'
import LoginClient from './login-client'

export const metadata = {
  title: 'Sign in | OneTeenOneTree',
  description: 'Sign in to OneTeenOneTree with Google, email magic link, or password.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/login',
  },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div className="text-sm text-white/60">Loading…</div>}>
        <LoginClient />
      </Suspense>
    </div>
  )
}
