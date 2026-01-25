import { Suspense } from 'react'
import PasswordLoginClient from './password-client'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const metadata = buildMetadata({
  title: 'Password sign in',
  description: 'Sign in to OneTeenOneTree using email and password.',
  path: '/login/password',
  noIndex: true,
})

export default function PasswordLoginPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Password sign in"
          description="Use your email and password to access OneTeenOneTree."
          icon={<Icon name="lock" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={null}>
            <PasswordLoginClient />
          </Suspense>
        </div>
      </Reveal>
    </PageShell>
  )
}
