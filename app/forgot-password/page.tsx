import ForgotPasswordClient from './forgot-password-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Reset password',
  description: 'Reset your OneTeenOneTree password.',
  path: '/forgot-password',
  noIndex: true,
})

export default function ForgotPasswordPage() {
  return (
    <div className="container py-12 space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Forgot password</h1>
        <p className="text-white/70">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>
      <ForgotPasswordClient />
    </div>
  )
}
