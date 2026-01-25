import ContactForm from './contact-form'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Reach out to OneTeenOneTree with questions, partnerships, or volunteering ideas.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Contact"
          description="Have a question, partnership idea, or want to get involved? Reach out to us."
          icon={<Icon name="mail" size={22} aria-hidden="true" />}
        />
      }
    >
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 inline-flex items-center gap-2">
            <MessageSquare size={18} className="text-[var(--acc)]" />
            Send a message
          </h2>
          <ContactForm />
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold inline-flex items-center gap-2">
            <Mail size={18} className="text-[var(--acc)]" />
            Other ways to reach us
          </h3>
          <p className="text-sm text-white/70">Prefer email? Write to us anytime.</p>
          <a
            href="mailto:support@oneteenonetree.org"
            className="text-sm text-white/80 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          >
            support@oneteenonetree.org
          </a>
        </div>
      </section>
    </PageShell>
  )
}
