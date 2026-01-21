import ResetPasswordClient from './reset-password-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Update password',
  description: 'Set a new password for your OneTeenOneTree account.',
  path: '/reset-password',
  noIndex: true,
})

export default function ResetPasswordPage() {
  return (
    <div className="container py-12 space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="text-white/70">Choose a new password to finish resetting your account.</p>
      </div>
      <ResetPasswordClient />
    </div>
  )
}
