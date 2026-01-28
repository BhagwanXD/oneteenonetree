import './globals.css'
import JsonLd from '@/components/seo/JsonLd'
import ClientProviders from '@/components/ClientProviders'
import Footer from '@/components/Footer'
import type { Metadata, Viewport } from 'next'
import { defaultDescription, defaultOgImage, siteUrl } from '@/lib/seo'

// --- ADVANCED SEO METADATA ---
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OneTeenOneTree — Youth-led Climate Action Movement',
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
    title: 'OneTeenOneTree — Youth-led Climate Action Movement',
    description: defaultDescription,
    siteName: 'OneTeenOneTree',
    locale: 'en_US',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'OneTeenOneTree — Youth-led Climate Action Movement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@oneteen.onetree',
    creator: '@oneteen.onetree',
    title: 'OneTeenOneTree — Youth-led Climate Action Movement',
    description: defaultDescription,
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

const globalJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'OneTeenOneTree',
  alternateName: ['One Teen One Tree', '1Teen1Tree'],
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'OneTeenOneTree is a youth-led environmental NGO and climate action movement empowering students to plant trees, promote sustainability, and create measurable ecological impact.',
  foundingDate: '2025',
  founder: {
    '@type': 'Person',
    name: 'Utkarsh Singh',
  },
  sameAs: [
    'https://www.instagram.com/oneteenonetree',
    'https://www.linkedin.com/company/oneteenonetree',
    'https://www.youtube.com/@oneteenonetree',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
}

// --- LAYOUT COMPONENT ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0E1512] text-white">
        <ClientProviders>
          {children}
        </ClientProviders>
        <Footer />

        {/* JSON-LD Structured Data for SEO */}
        <JsonLd data={globalJsonLd} id="global-jsonld" />
      </body>
    </html>
  )
}
