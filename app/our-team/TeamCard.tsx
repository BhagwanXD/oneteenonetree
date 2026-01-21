'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
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

export default function TeamCard({ member }: { member: TeamMember }) {
  const [useFallback, setUseFallback] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
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

  const isFeatured = Boolean(member.badge)

  return (
    <div
      ref={ref}
      className={`card p-0 overflow-hidden flex flex-col group transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${isFeatured ? 'border-emerald-400/40 shadow-[0_0_20px_rgba(0,208,132,0.14)]' : ''}`}
    >
      <div className="relative h-56 w-full bg-white/5 border-b border-white/10">
        {!useFallback ? (
          <Image
            src={member.image}
            alt={`${member.name} — OneTeenOneTree team member`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setUseFallback(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/10 via-transparent to-white/5">
            <span className="text-3xl font-semibold text-white/70">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>

      <div className="p-5 space-y-3">
        {member.badge ? (
          <span className="inline-flex items-center rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200/90">
            {member.badge}
          </span>
        ) : null}
        <div>
          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
          <p className="text-xs uppercase tracking-[0.22em] text-white/50 mt-1">
            {member.educationOrProfession}
          </p>
          {member.tagline ? (
            <p className="text-sm text-white/70 mt-2">{member.tagline}</p>
          ) : null}
        </div>

        {!member.placeholder ? (
          <Link
            href={`/our-team/${member.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] w-fit"
          >
            View more
          </Link>
        ) : null}

        <div className="flex items-center gap-2">
          {socials.length ? (
            socials.map(({ type, url }) => (
              <a
                key={`${member.slug}-${type}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${socialConfig[type].label} — ${member.name}`}
                title={`${socialConfig[type].label} — ${member.name}`}
                className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] hover:shadow-[0_0_12px_rgba(0,208,132,0.18)] hover:scale-[1.05]"
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
  )
}
