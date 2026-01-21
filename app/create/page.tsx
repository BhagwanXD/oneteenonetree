import CreateClient from './create-client'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Create',
  description:
    'Create OneTeenOneTree posters and social cards for impact updates, volunteer calls, and drive highlights.',
  path: '/create',
})

export default function CreatePage() {
  return <CreateClient />
}
