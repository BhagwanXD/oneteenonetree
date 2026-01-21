import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupabaseProvider from '@/components/SupabaseProvider'
import ProfileProvider from '@/components/ProfileProvider'
import SeoJsonLd from '@/components/SeoJsonLd'
import type { Metadata, Viewport } from 'next'
import { defaultDescription, defaultOgImage, siteUrl } from '@/lib/seo'

// --- ADVANCED SEO METADATA ---
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OneTeenOneTree - A Youth-led Green Pledge',
    template: '%s | OneTeenOneTree',
  },
  description: defaultDescription,
  applicationName: 'OneTeenOneTree',
  category: 'Environment',
  authors: [{ name: 'Utkarsh Singh', url: 'https://www.linkedin.com/in/utkarshsngh/' }],
  creator: 'Utkarsh Singh',
  publisher: 'OneTeenOneTree',
  keywords: [
    'OneTeenOneTree',
    'Youth Climate Action',
    'Tree Pledge',
    'Sustainability',
    'Environment Project',
    'Student Climate Initiative',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'OneTeenOneTree - A Youth-led Green Pledge',
    description:
      'Join thousands of students making real environmental impact. Take the pledge, plant a tree, and inspire others.',
    siteName: 'OneTeenOneTree',
    locale: 'en_US',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'OneTeenOneTree - Youth-led Green Pledge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@oneteen.onetree',
    creator: '@oneteen.onetree',
    title: 'OneTeenOneTree - A Youth-led Green Pledge',
    description:
      'Take the pledge, plant a tree, and inspire others - youth-driven climate action.',
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1510',
}

// --- LAYOUT COMPONENT ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0E1512] text-white">
        <SupabaseProvider>
          <ProfileProvider>
            <Header />
            <main className="container">{children}</main>
            <Footer />
          </ProfileProvider>
        </SupabaseProvider>

        {/* JSON-LD Structured Data for SEO */}
        <SeoJsonLd />
      </body>
    </html>
  )
}
