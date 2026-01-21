import TeamCard from './TeamCard'
import { visibleTeamMembers } from '@/data/team'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import Icon from '@/components/Icon'

export const metadata = buildMetadata({
  title: 'Our Team',
  description:
    'Meet the youth-led team behind OneTeenOneTree and the community builders driving local climate action.',
  path: '/our-team',
})

export default function OurTeamPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold">Our Team</h1>
            <p className="text-white/70 mt-3 text-lg">
              A youth-led team of students and mentors driving real, local climate action.
            </p>
            <p className="text-sm text-white/50 mt-3">Active since 2025 | India</p>
            <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-white/0 via-emerald-400/60 to-white/0" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleTeamMembers.map((member, index) => (
              <TeamCard key={`${member.slug}-${index}`} member={member} />
            ))}

            <div className="card p-5 flex flex-col h-full gap-4 border-white/15 bg-white/[0.04]">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-200 text-xl">
                  <Icon name="volunteer" size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Join the Team</h3>
                  <p className="text-sm text-white/70 mt-2">
                    We&apos;re growing our team. Want to volunteer with us?
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {[
                  'Volunteer in local drives',
                  'Help with outreach & schools',
                  'Build real impact projects',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--acc)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <Link href="/contact" className="btn">
                  <span>Get involved</span>
                  <Icon name="arrowForward" size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/get-involved"
                  className="text-sm text-white/60 hover:text-white transition inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                >
                  <span>Learn more</span>
                  <Icon name="arrowForward" size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="card p-5 flex flex-col justify-between gap-4 border-white/15 bg-white/[0.04]">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/80 text-xl">
                  <Icon name="award" size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">More team members</h3>
                  <p className="text-sm text-white/70 mt-2">
                    New members are onboarding soon as we expand across cities.
                  </p>
                </div>
              </div>
              <span className="text-xs text-white/50">Updates posted regularly.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Community-led',
                detail: 'Local teams co-create each drive with residents and schools.',
                icon: <Icon name="groups" size={22} aria-hidden="true" />,
              },
              {
                title: 'Volunteer-driven',
                detail: 'Students and mentors run logistics, outreach, and care.',
                icon: <Icon name="volunteer" size={22} aria-hidden="true" />,
              },
              {
                title: 'Local action',
                detail: 'We focus on real impact in neighborhoods and campuses.',
                icon: <Icon name="location" size={22} aria-hidden="true" />,
              },
            ].map((item) => (
              <div key={item.title} className="card p-5 text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/50 mt-10">
            This team is actively growing as OneTeenOneTree expands across cities.
          </p>
          <p className="text-center text-sm text-white/60 mt-4 max-w-2xl mx-auto">
            Meet the student-led team behind OneTeenOneTree and learn how we organize verified
            tree plantation drives with schools, volunteers, and local partners.
          </p>
        </div>
      </section>
    </div>
  )
}
