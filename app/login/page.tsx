import { Suspense } from 'react'
import LoginClient from './login-client'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const metadata = buildMetadata({
  title: 'Sign in',
  description: 'Sign in to OneTeenOneTree with Google or email.',
  path: '/login',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Sign in"
          description="Sign in to OneTeenOneTree with Google or email."
          icon={<Icon name="user" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={null}>
            <LoginClient />
          </Suspense>
        </div>
      </Reveal>
    </PageShell>
  )
}
