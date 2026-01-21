import Script from 'next/script'
import { siteUrl } from '@/lib/seo'

export default function SeoJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'OneTeenOneTree',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo.png`,
        sameAs: [
          'https://www.instagram.com/oneteen.onetree/',
          'https://www.linkedin.com/company/oneteen-onetree/',
          'https://www.linkedin.com/in/utkarshsngh/',
        ],
        description:
          'OneTeenOneTree empowers students to take climate action by pledging to plant trees and inspire their peers.',
        foundingDate: '2024',
        founder: {
          '@type': 'Person',
          name: 'Utkarsh Singh',
          url: 'https://www.linkedin.com/in/utkarshsngh/',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'support@oneteenonetree.org',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'OneTeenOneTree',
        description:
          'Youth-led climate action platform where students pledge to plant and care for trees.',
        inLanguage: 'en-US',
        publisher: { '@id': `${siteUrl}/#organization` },
        siteNavigationElement: [
          { '@type': 'SiteNavigationElement', name: 'Home', url: `${siteUrl}/` },
          { '@type': 'SiteNavigationElement', name: 'About', url: `${siteUrl}/about` },
          { '@type': 'SiteNavigationElement', name: 'Our Team', url: `${siteUrl}/our-team` },
          { '@type': 'SiteNavigationElement', name: 'Pledge', url: `${siteUrl}/pledge` },
          { '@type': 'SiteNavigationElement', name: 'Plant', url: `${siteUrl}/plant` },
          { '@type': 'SiteNavigationElement', name: 'Donate', url: `${siteUrl}/donate` },
          { '@type': 'SiteNavigationElement', name: 'Leaderboard', url: `${siteUrl}/leaderboard` },
          { '@type': 'SiteNavigationElement', name: 'Blog', url: `${siteUrl}/blog` },
          { '@type': 'SiteNavigationElement', name: 'Social', url: `${siteUrl}/social` },
          { '@type': 'SiteNavigationElement', name: 'Gallery', url: `${siteUrl}/gallery` },
          { '@type': 'SiteNavigationElement', name: 'Press', url: `${siteUrl}/press` },
          { '@type': 'SiteNavigationElement', name: 'FAQ', url: `${siteUrl}/faq` },
          { '@type': 'SiteNavigationElement', name: 'Contact', url: `${siteUrl}/contact` },
          { '@type': 'SiteNavigationElement', name: 'Get Involved', url: `${siteUrl}/get-involved` },
          { '@type': 'SiteNavigationElement', name: 'Games', url: `${siteUrl}/games` },
        ],
      },
    ],
  }

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
