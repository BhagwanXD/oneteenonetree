import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, siteUrl } from '@/lib/seo'
import AboutContent from './AboutContent'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

export const metadata = buildMetadata({
  title: 'About',
  description:
    'OneTeenOneTree is a youth-led environmental initiative and climate action movement in India turning pledges into verified tree plantations and student-led drives.',
  path: '/about',
})

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'OneTeenOneTree',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description:
        'OneTeenOneTree is a youth-led environmental initiative and climate action movement turning pledges into real trees through verified community drives in India.',
      foundingDate: '2025',
      founder: {
        '@type': 'Person',
        name: 'Utkarsh Singh',
      },
      areaServed: 'IN',
      sameAs: [
        'https://www.instagram.com/oneteen.onetree/',
        'https://www.linkedin.com/company/oneteen-onetree/',
        'https://www.youtube.com/@oneteenonetree',
      ],
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#utkarsh-singh`,
      name: 'Utkarsh Singh',
      jobTitle: 'Founder',
      affiliation: { '@id': `${siteUrl}/#organization` },
      sameAs: ['https://www.linkedin.com/in/utkarshsngh/'],
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#jahnasi-samal`,
      name: 'Jahnasi Samal',
      jobTitle: 'Co-founder',
      affiliation: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'AboutPage',
      '@id': `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: 'About OneTeenOneTree',
      description:
        'Learn how OneTeenOneTree became a youth-led climate action movement in India, with verified tree plantation drives and student leadership.',
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
    },
  ],
}

export default function AboutPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="About OneTeenOneTree"
          description="OneTeenOneTree is a youth-led environmental initiative and climate action movement based in India, turning pledges into real trees through verified community drives."
          icon={<Icon name="info" size={22} aria-hidden="true" />}
        />
      }
    >
      <JsonLd data={aboutJsonLd} id="about-jsonld" />
      <AboutContent />
    </PageShell>
  )
}
