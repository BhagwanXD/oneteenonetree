import DonateClient from './DonateClient'

export const metadata = {
  title: 'Donate | OneTeenOneTree',
  description:
    'Support OneTeenOneTree with donations that fund plantation drives, saplings, logistics, and community programs.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/donate',
  },
  openGraph: {
    title: 'Donate | OneTeenOneTree',
    description:
      'Support OneTeenOneTree with donations that fund plantation drives, saplings, logistics, and community programs.',
    url: 'https://www.oneteenonetree.org/donate',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'Donate | OneTeenOneTree',
    description:
      'Support OneTeenOneTree with donations that fund plantation drives, saplings, logistics, and community programs.',
    images: ['/og-image.jpg'],
  },
}

export default function DonatePage() {
  return <DonateClient />
}
