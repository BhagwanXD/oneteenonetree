import Script from 'next/script'
import { faqSections } from './faq-data'
import FaqClient from './faq-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Find answers about OneTeenOneTree, the pledge, planting verification, donations, partnerships, and student-led tree plantation drives.',
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
    <div className="container py-12">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </div>
  )
}
