import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { Handshake } from 'lucide-react'

export const metadata = buildMetadata({
  title: 'Get Involved',
  description:
    'Join OneTeenOneTree through volunteering, school chapters, or partnerships to support verified tree plantation drives.',
  path: '/get-involved',
})

export default function GetInvolvedPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Get Involved"
          description="Join OneTeenOneTree through volunteering, school chapters, or partnerships that power student-led tree plantation drives."
          icon={<Icon name="groups" size={22} aria-hidden="true" />}
          actions={
            <Link href="/contact" className="btn">
              Contact the team
            </Link>
          }
        />
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Volunteer with us',
            detail:
              'Support local planting events, mentorship, verification assistance, or outreach to schools.',
          },
          {
            title: 'Start a school chapter',
            detail:
              'Organize pledges and planting days with your school. We can help with tools and playbooks.',
          },
          {
            title: 'Partner as CSR or community',
            detail:
              'Co-create verified drives and student impact reporting with your organization or community group.',
          },
        ].map((item) => (
          <div key={item.title} className="card p-5 space-y-3">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-white/70">{item.detail}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="card text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold inline-flex items-center gap-2 justify-center">
            <Handshake size={18} className="text-[var(--acc)]" />
            Ready to collaborate?
          </h2>
          <p className="text-white/70">
            Tell us about your goals and we will help plan the next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn">
              Get in touch
            </Link>
            <Link href="/pledge" className="btn">
              Take the pledge
            </Link>
            <Link href="/plant" className="btn">
              Plant & verify
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
