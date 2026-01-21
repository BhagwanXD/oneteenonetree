import CreateClient from './create-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Create your OneTeenOneTree story card',
  description:
    'Generate a OneTeenOneTree story card with your name and optional photo, ready to share.',
  path: '/create',
})

export default function CreatePage() {
  return <CreateClient />
}
