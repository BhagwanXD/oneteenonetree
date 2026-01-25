import { buildMetadata } from '@/lib/seo'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import LeaderboardClient from './LeaderboardClient'

export const metadata = buildMetadata({
  title: 'Leaderboard',
  description: 'See the top OneTeenOneTree planters across schools and cities.',
  path: '/leaderboard',
})

export default function LeaderboardPage() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Leaderboard"
          description="See the top OneTeenOneTree planters across schools and cities."
          icon={<Icon name="leaderboard" size={22} aria-hidden="true" />}
        />
      }
    >
      <LeaderboardClient />
    </PageShell>
  )
}
