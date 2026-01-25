import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

export const metadata = {
  title: 'Privacy Policy - OneTeenOneTree',
  description: 'OneTeenOneTree privacy policy and data handling overview.',
  openGraph: {
    title: 'Privacy Policy - OneTeenOneTree',
    description: 'OneTeenOneTree privacy policy and data handling overview.',
    url: '/legal/privacy',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function Page() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Privacy Policy"
          description="How OneTeenOneTree collects, uses, and protects your information."
          icon={<Icon name="shield" size={22} aria-hidden="true" />}
        />
      }
    >
      <section className="card max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl font-semibold">Privacy overview</h2>
        <p className="text-white/70">
          This is a placeholder privacy policy for the MVP. A detailed version will be published
          as we expand partnerships and programs.
        </p>
      </section>
    </PageShell>
  )
}
