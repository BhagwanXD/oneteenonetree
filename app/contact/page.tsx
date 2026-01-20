import ContactForm from './contact-form'

export const metadata = {
  title: 'Contact | OneTeenOneTree',
  description:
    'Reach out to OneTeenOneTree with questions, partnerships, or volunteering ideas.',
  alternates: {
    canonical: 'https://www.oneteenonetree.org/contact',
  },
  openGraph: {
    title: 'Contact | OneTeenOneTree',
    description:
      'Reach out to OneTeenOneTree with questions, partnerships, or volunteering ideas.',
    url: 'https://www.oneteenonetree.org/contact',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'Contact | OneTeenOneTree',
    description:
      'Reach out to OneTeenOneTree with questions, partnerships, or volunteering ideas.',
    images: ['/og-image.jpg'],
  },
}

export default function ContactPage() {
  return (
    <div className="py-12 space-y-10">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-white/70 text-lg">
          Have a question, partnership idea, or want to get involved? Reach out to us.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Send a message</h2>
          <ContactForm />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-3">
          <h3 className="text-lg font-semibold">Other ways to reach us</h3>
          <p className="text-sm text-white/70">
            Prefer email? Write to us anytime.
          </p>
          <a
            href="mailto:support@oneteenonetree.org"
            className="text-sm text-white/80 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          >
            support@oneteenonetree.org
          </a>
        </div>
      </section>
    </div>
  )
}
