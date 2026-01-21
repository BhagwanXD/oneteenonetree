'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import type { TeamMember } from '@/data/team'

type SocialType = 'instagram' | 'linkedin' | 'twitter' | 'youtube'

const socialConfig: Record<
  SocialType,
  { label: string; icon: React.ReactNode; buildUrl: (value: string) => string }
> = {
  instagram: {
    label: 'Instagram',
    icon: <FaInstagram className="text-lg" />,
    buildUrl: (value) => `https://www.instagram.com/${value}`,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: <FaLinkedin className="text-lg" />,
    buildUrl: (value) => `https://www.linkedin.com/${value}`,
  },
  twitter: {
    label: 'X',
    icon: <FaTwitter className="text-lg" />,
    buildUrl: (value) => `https://x.com/${value}`,
  },
  youtube: {
    label: 'YouTube',
    icon: <FaYoutube className="text-lg" />,
    buildUrl: (value) => `https://www.youtube.com/${value.startsWith('@') ? value : `@${value}`}`,
  },
}

const normalizeSocial = (value: string, type: SocialType) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const cleaned = value.replace(/^@/, '')
  return socialConfig[type].buildUrl(cleaned)
}

export default function MemberHero({ member }: { member: TeamMember }) {
  const [useFallback, setUseFallback] = useState(false)
  const initials = useMemo(() => {
    const parts = member.name.split(' ').filter(Boolean)
    if (!parts.length) return 'OT'
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [member.name])

  const socials = (Object.keys(member.socials) as SocialType[])
    .map((key) => ({
      type: key,
      url: normalizeSocial(member.socials[key], key),
    }))
    .filter((item) => item.url)

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            {!useFallback ? (
              <Image
                src={member.image}
                alt={`${member.name} — OneTeenOneTree team member`}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 100vw"
                className="object-cover"
                onError={() => setUseFallback(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 via-transparent to-white/5">
                <span className="text-4xl font-semibold text-white/70">{initials}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200/90">
                {member.role}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold">{member.name}</h1>
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">
                {member.educationOrProfession}
              </p>
              {member.tagline ? (
                <p className="text-white/70 text-lg">{member.tagline}</p>
              ) : null}
              {member.location ? (
                <p className="text-sm text-white/50">Based in {member.location}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {socials.length ? (
                socials.map(({ type, url }) => (
                  <a
                    key={`${member.slug}-${type}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${socialConfig[type].label} — ${member.name}`}
                    title={`${socialConfig[type].label} — ${member.name}`}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                  >
                    {socialConfig[type].icon}
                  </a>
                ))
              ) : (
                <span className="text-xs text-white/50">Social links coming soon.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
