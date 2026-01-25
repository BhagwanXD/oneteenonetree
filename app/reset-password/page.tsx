import ResetPasswordClient from './reset-password-client'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const metadata = buildMetadata({
  title: 'Update password',
  description: 'Set a new password for your OneTeenOneTree account.',
  path: '/reset-password',
  noIndex: true,
})

export default function ResetPasswordPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Reset password"
          description="Choose a new password to finish resetting your account."
          icon={<Icon name="lock" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <div className="max-w-2xl mx-auto">
          <ResetPasswordClient />
        </div>
      </Reveal>
    </PageShell>
  )
}
