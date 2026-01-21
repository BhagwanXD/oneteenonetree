import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import MemberHero from '../MemberHero'
import { getTeamMemberBySlug, visibleTeamMembers } from '@/data/team'
import { defaultOgImage, siteUrl } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

const normalizeSocial = (value: string, type: 'instagram' | 'linkedin' | 'twitter' | 'youtube') => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const cleaned = value.replace(/^@/, '')
  if (type === 'instagram') return `https://www.instagram.com/${cleaned}`
  if (type === 'linkedin') return `https://www.linkedin.com/${cleaned}`
  if (type === 'twitter') return `https://x.com/${cleaned}`
  return `https://www.youtube.com/${cleaned.startsWith('@') ? cleaned : `@${cleaned}`}`
}

const getSocialLinks = (member: ReturnType<typeof getTeamMemberBySlug>) => {
  if (!member) return []
  const types = Object.keys(member.socials) as Array<keyof typeof member.socials>
  return types
    .map((type) => normalizeSocial(member.socials[type], type))
    .filter(Boolean)
}

export function generateStaticParams() {
  return visibleTeamMembers.map((member) => ({ slug: member.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)
  if (!member) return {}

  const title = member.seo?.title || `${member.name} | OneTeenOneTree`
  const description =
    member.seo?.description ||
    `${member.name} is part of the OneTeenOneTree team, supporting youth-led climate action and verified tree plantation drives.`

  const imageUrl = member.image ? `${siteUrl}${member.image}` : defaultOgImage

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/our-team/${member.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/our-team/${member.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function TeamMemberPage({ params }: PageProps) {
  return (
    <TeamMemberContent params={params} />
  )
}

async function TeamMemberContent({ params }: PageProps) {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)
  if (!member) notFound()

  const imageUrl = member.image ? `${siteUrl}${member.image}` : defaultOgImage

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    url: `${siteUrl}/our-team/${member.slug}`,
    image: imageUrl,
    jobTitle: member.role,
    sameAs: getSocialLinks(member),
    worksFor: {
      '@type': 'Organization',
      name: 'OneTeenOneTree',
      url: `${siteUrl}/`,
    },
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <Script
        id={`person-schema-${member.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <MemberHero member={member} />

      <section className="py-10">
        <div className="container space-y-6">
          <Link
            href="/our-team"
            className="text-sm text-white/60 hover:text-white transition inline-flex"
          >
            Back to Our Team
          </Link>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">About {member.name}</h2>
            {(member.longBio ?? []).map((paragraph) => (
              <p key={paragraph} className="text-white/70 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {member.highlights?.length ? (
        <section className="py-10">
          <div className="container space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Focus areas</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {member.highlights.map((item) => (
                <div key={item} className="card p-5">
                  <p className="text-sm text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-10">
        <div className="container grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">Collaborate with OneTeenOneTree</h2>
            <p className="text-white/70">
              Have an idea for a student-led tree plantation drive or a partnership? We would love
              to hear from you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn">
                Get in touch
              </Link>
              <Link href="/pledge" className="btn">
                Take the pledge
              </Link>
              <Link href="/plant" className="btn">
                Plant & verify
              </Link>
              <Link href="/donate" className="btn">
                Donate
              </Link>
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <h3 className="text-lg font-semibold">Quick links</h3>
            <p className="text-sm text-white/70">
              Explore how OneTeenOneTree turns student action into verified impact.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href="/pledge" className="hover:text-white transition">
                How the pledge works
              </Link>
              <Link href="/plant" className="hover:text-white transition">
                Verification and planting guide
              </Link>
              <Link href="/donate" className="hover:text-white transition">
                Support with a donation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
