import ForgotPasswordClient from './forgot-password-client'

export const metadata = {
  title: 'Reset password | OneTeenOneTree',
  description: 'Reset your OneTeenOneTree password.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/forgot-password',
  },
  robots: { index: false, follow: false },
}

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
