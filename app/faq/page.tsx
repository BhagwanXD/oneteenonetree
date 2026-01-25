import { faqSections } from './faq-data'
import FaqClient from './faq-client'
import { buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

export const metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Find answers about OneTeenOneTree, the youth-led climate action movement in India, the pledge, planting verification, donations, and partnerships.',
  path: '/faq',
})

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerText,
      },
    }))
  ),
}

export default function FaqPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Frequently Asked Questions"
          description="OneTeenOneTree is youth-led — here are answers about the pledge, planting drives, verification, donations, and partnerships."
          icon={<Icon name="help" size={22} aria-hidden="true" />}
        />
      }
    >
      <JsonLd data={faqJsonLd} id="faq-schema" />
      <FaqClient />
    </PageShell>
  )
}
