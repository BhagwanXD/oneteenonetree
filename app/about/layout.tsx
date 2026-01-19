export const metadata = {
  title: 'About - OneTeenOneTree',
  description:
    'Learn how OneTeenOneTree empowers students to plant trees, track impact, and lead climate action.',
  openGraph: {
    title: 'About - OneTeenOneTree',
    description:
      'Learn how OneTeenOneTree empowers students to plant trees, track impact, and lead climate action.',
    url: '/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
