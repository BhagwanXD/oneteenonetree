import DonateClient from './DonateClient'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Donate',
  description:
    'Support OneTeenOneTree with donations that fund plantation drives, saplings, logistics, and community programs.',
  path: '/donate',
})

export default function DonatePage() {
  return <DonateClient />
}
