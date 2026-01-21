import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Get Involved',
  description:
    'Join OneTeenOneTree through volunteering, school chapters, or partnerships to support verified tree plantation drives.',
  path: '/get-involved',
})

export default function GetInvolvedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12">
        <div className="container text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">Get Involved</h1>
          <p className="text-white/70 text-lg">
            Join OneTeenOneTree through volunteering, school chapters, or partnerships that power
            student-led tree plantation drives.
          </p>
          <Link href="/contact" className="btn justify-center">
            Contact the team
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-6 md:grid-cols-3">
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
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="card text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to collaborate?</h2>
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
        </div>
      </section>
    </div>
  )
}
