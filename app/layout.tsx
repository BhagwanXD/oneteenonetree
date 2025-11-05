import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupabaseProvider from '@/components/SupabaseProvider'
import ProfileProvider from '@/components/ProfileProvider'
import Script from 'next/script'
 

// --- ADVANCED SEO METADATA ---
export const metadata = {
  metadataBase: new URL('https://www.oneteenonetree.org'),
  title: {
    default: 'OneTeenOneTree — A Youth-led Green Pledge',
    template: '%s | OneTeenOneTree'
  },
  description:
    'OneTeenOneTree.org empowers students worldwide to take climate action by pledging to plant and care for trees — inspiring a generation of eco-conscious youth.',
  keywords: [
    'OneTeenOneTree',
    'One Teen One Tree',
    'Youth Climate Action',
    'Tree Pledge',
    'Sustainability',
    'Environment Project',
    'Student Climate Initiative'
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.oneteenonetree.org',
    title: 'OneTeenOneTree — A Youth-led Green Pledge',
    description:
      'Join thousands of students making real environmental impact. Take the pledge, plant a tree, and inspire others.',
    siteName: 'OneTeenOneTree',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneTeenOneTree.org — Youth-led Green Pledge'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@oneteen.onetree',
    title: 'OneTeenOneTree — A Youth-led Green Pledge',
    description:
      'Take the pledge, plant a tree, and inspire others — youth-driven climate action.',
    images: ['/og-image.jpg']
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

// --- STRUCTURED DATA: ORGANIZATION ---
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OneTeenOneTree",
  url: "https://www.oneteenonetree.org",
  logo: "https://www.oneteenonetree.org/logo.png",
  sameAs: [
    "https://www.instagram.com/oneteen.onetree/",
    "https://www.linkedin.com/company/oneteen-onetree/",
    "https://www.linkedin.com/in/utkarshsngh/"
  ],
  description:
    "OneTeenOneTree.org empowers students to take climate action by pledging to plant trees and inspire their peers.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Utkarsh Singh",
    url: "https://www.linkedin.com/in/utkarshsngh/"
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Support",
    email: "support@oneteenonetree.org"
  }
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
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  )
}
