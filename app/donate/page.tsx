import DonateClient from './DonateClient'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

export const metadata = buildMetadata({
  title: 'Donate',
  description:
    'Support OneTeenOneTree with donations that fund plantation drives, saplings, logistics, and community programs.',
  path: '/donate',
})

export default function DonatePage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Donate"
          description="Your support funds plantation drives, saplings, logistics, and community programs led by young changemakers."
          icon={<Icon name="volunteer" size={22} aria-hidden="true" />}
          actions={
            <a href="#payment-details" className="btn">
              View payment details
            </a>
          }
        />
      }
    >
      <DonateClient />
    </PageShell>
  )
}
