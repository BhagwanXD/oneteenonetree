export const metadata = {
  title: 'Leaderboard - OneTeenOneTree',
  description:
    'Explore the live leaderboard of students and schools planting trees across the globe.',
  openGraph: {
    title: 'Leaderboard - OneTeenOneTree',
    description:
      'Explore the live leaderboard of students and schools planting trees across the globe.',
    url: '/leaderboard',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
