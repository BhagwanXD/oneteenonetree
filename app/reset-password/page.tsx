import ResetPasswordClient from './reset-password-client'

export const metadata = {
  title: 'Update password | OneTeenOneTree',
  description: 'Set a new password for your OneTeenOneTree account.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/reset-password',
  },
  robots: { index: false, follow: false },
}

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
