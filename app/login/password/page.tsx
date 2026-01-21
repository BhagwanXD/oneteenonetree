import { Suspense } from 'react'
import PasswordLoginClient from './password-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Password sign in',
  description: 'Sign in to OneTeenOneTree using email and password.',
  path: '/login/password',
  noIndex: true,
})

export default function PasswordLoginPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <Suspense fallback={<div className="text-sm text-white/60">Loading…</div>}>
        <PasswordLoginClient />
      </Suspense>
    </div>
  )
}
