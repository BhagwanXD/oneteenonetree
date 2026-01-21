import CreateClient from './create-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Create your OneTeenOneTree poster',
  description:
    'Generate a OneTeenOneTree pledge poster with your name and photo, ready to share.',
  path: '/create',
})

export default function CreatePage() {
  return <CreateClient />
}
