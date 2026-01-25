import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

export const metadata = {
  title: 'Terms of Service - OneTeenOneTree',
  description: 'OneTeenOneTree terms of service and usage guidelines.',
  openGraph: {
    title: 'Terms of Service - OneTeenOneTree',
    description: 'OneTeenOneTree terms of service and usage guidelines.',
    url: '/legal/terms',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function Page() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Terms of Service"
          description="Usage guidelines for OneTeenOneTree."
          icon={<Icon name="info" size={22} aria-hidden="true" />}
        />
      }
    >
      <section className="card max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl font-semibold">Terms overview</h2>
        <p className="text-white/70">
          This is a placeholder terms page for the MVP. A full policy will be published as the
          platform expands.
        </p>
      </section>
    </PageShell>
  )
}
