import ForgotPasswordClient from './forgot-password-client'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const metadata = buildMetadata({
  title: 'Reset password',
  description: 'Reset your OneTeenOneTree password.',
  path: '/forgot-password',
  noIndex: true,
})

export default function ForgotPasswordPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Forgot password"
          description="Enter your email and we’ll send a reset link."
          icon={<Icon name="mail" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <div className="max-w-2xl mx-auto">
          <ForgotPasswordClient />
        </div>
      </Reveal>
    </PageShell>
  )
}
