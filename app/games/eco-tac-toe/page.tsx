import EcoTacToeClient from './EcoTacToeClient'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

export const metadata = {
  title: 'Eco Tac-Toe — Games | OneTeenOneTree',
  description: 'Play eco-themed Tic-Tac-Toe: ☀️ vs 🌱',
}

export default function Page() {
  return (
    <PageShell
      header={
        <PageHeader
          title="Eco Tac-Toe"
          description="☀️ vs 🌱 — first to 3 in a row wins. Two-player local game."
          icon={<Icon name="games" size={22} aria-hidden="true" />}
          actions={
            <Link href="/games" className="text-white/70 hover:text-white underline">
              ← Back to Games
            </Link>
          }
        />
      }
    >
      <Reveal>
        <EcoTacToeClient />
      </Reveal>
    </PageShell>
  )
}
