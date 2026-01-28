import JsonLd from '@/components/seo/JsonLd'
import PageShell from '@/components/site/PageShell'
import { buildMetadata, siteUrl } from '@/lib/seo'

export const metadata = {
  ...buildMetadata({
    title: 'OneTeenOneTree (oneteenonetree.org)',
    description:
      'OneTeenOneTree is a youth-led environmental movement and climate action initiative based in India. We work with students, schools, and communities to turn pledges into real trees through verified plantation and sustainability programs.',
    path: '/brand',
  }),
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'OneTeenOneTree',
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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is OneTeenOneTree a book?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. OneTeenOneTree is a youth-led environmental movement and climate action initiative. This website (oneteenonetree.org) is not affiliated with any book of a similar name.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is OneTeenOneTree?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A youth-led climate action initiative based in India that turns pledges into verified tree plantation and sustainability programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is OneTeenOneTree based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'India.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I participate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can take the pledge on oneteenonetree.org/pledge and join drives via the website.',
      },
    },
  ],
}

export default function BrandPage() {
  return (
    <PageShell
      useContainer={false}
      innerClassName="mx-auto max-w-[980px] px-4 pb-20 pt-12 sm:px-6 lg:px-8"
    >
      <JsonLd data={organizationJsonLd} id="brand-organization-jsonld" />
      <JsonLd data={faqJsonLd} id="brand-faq-jsonld" />

      <section className="space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:px-10">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            OneTeenOneTree (oneteenonetree.org)
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            OneTeenOneTree is a youth-led environmental movement and climate action initiative based in India. We work with students, schools, and communities to turn pledges into real trees through verified plantation and sustainability programs.
          </p>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            This website and initiative are not affiliated with any book, publication, or commercial product of a similar name.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Who we are</h2>
              <ul className="mt-4 list-disc space-y-2 text-sm text-white/75 sm:text-base">
                <li className="ml-5">Youth-led climate action movement</li>
                <li className="ml-5">Student and school programs</li>
                <li className="ml-5">Verified plantation drives</li>
                <li className="ml-5">Sustainability education and community engagement</li>
                <li className="ml-5">Based in India, active since 2025</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Explore OneTeenOneTree</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-emerald-100 sm:text-base">
                <a className="underline underline-offset-4 hover:text-white" href="/about">
                  About
                </a>
                <a className="underline underline-offset-4 hover:text-white" href="/faq">
                  FAQ
                </a>
                <a className="underline underline-offset-4 hover:text-white" href="/insights">
                  Insights
                </a>
                <a className="underline underline-offset-4 hover:text-white" href="/gallery">
                  Gallery
                </a>
                <a className="underline underline-offset-4 hover:text-white" href="/pledge">
                  Take the pledge
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
