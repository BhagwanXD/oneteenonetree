import JsonLd from '@/components/seo/JsonLd'
import { siteUrl } from '@/lib/seo'

export const metadata = {
  title: 'SEO Disambiguation',
  description: 'Entity clarification for OneTeenOneTree.',
  robots: { index: false, follow: false },
}

const disambiguationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'OneTeenOneTree',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description:
        'OneTeenOneTree is a youth-led climate action movement and environmental initiative based in India. It is not affiliated with a book of a similar name.',
      areaServed: 'IN',
      sameAs: [
        'https://www.instagram.com/oneteen.onetree/',
        'https://www.linkedin.com/company/oneteen-onetree/',
        'https://www.youtube.com/@oneteenonetree',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/seo-disambiguation#webpage`,
      url: `${siteUrl}/seo-disambiguation`,
      name: 'OneTeenOneTree SEO Disambiguation',
      description:
        'OneTeenOneTree is a youth-led climate action movement and environmental initiative based in India. It is not affiliated with a book of a similar name.',
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
    },
  ],
}

export default function SeoDisambiguationPage() {
  return (
    <div className="sr-only">
      <JsonLd data={disambiguationJsonLd} id="seo-disambiguation-jsonld" />
      <h1>OneTeenOneTree SEO Disambiguation</h1>
      <p>
        OneTeenOneTree is a youth-led climate action movement and environmental initiative based
        in India. It is not affiliated with a book of a similar name.
      </p>
    </div>
  )
}
