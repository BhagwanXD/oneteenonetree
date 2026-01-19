export const metadata = {
  title: 'Terms of Service - OneTeenOneTree',
  description: 'OneTeenOneTree terms of service and usage guidelines.',
  openGraph: {
    title: 'Terms of Service - OneTeenOneTree',
    description: 'OneTeenOneTree terms of service and usage guidelines.',
    url: '/legal/terms',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function Page() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold">Terms</h2>
      <p className="text-white/70 mt-2">Basic placeholder terms for MVP.</p>
    </div>
  )
}
