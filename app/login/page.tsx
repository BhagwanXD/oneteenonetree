import { Suspense } from 'react'
import LoginClient from './login-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Sign in',
  description: 'Sign in to OneTeenOneTree with Google or email.',
  path: '/login',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div className="text-sm text-white/60">Loading…</div>}>
        <LoginClient />
      </Suspense>
    </div>
  )
}
