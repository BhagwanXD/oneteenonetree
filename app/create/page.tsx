import CreateClient from './create-client'
import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

export const metadata = buildMetadata({
  title: 'Create your OneTeenOneTree story card',
  description:
    'Generate a OneTeenOneTree story card with your name and optional photo, ready to share.',
  path: '/create',
})

export default function CreatePage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Create your OneTeenOneTree story card"
          description="Generate a share-ready story card in seconds."
          icon={<Icon name="edit" size={22} aria-hidden="true" />}
        />
      }
    >
      <Reveal>
        <CreateClient />
      </Reveal>
    </PageShell>
  )
}
