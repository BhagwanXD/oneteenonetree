import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { visibleTeamMembers } from '@/data/team'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = [
    '/',
    '/about',
    '/pledge',
    '/plant',
    '/donate',
    '/our-team',
    '/faq',
    '/gallery',
    '/press',
    '/contact',
    '/social',
    '/leaderboard',
    '/blog',
    '/create',
    '/get-involved',
    '/games',
    '/games/eco-tac-toe',
    '/legal/privacy',
    '/legal/terms',
  ]

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.7,
  }))

  const teamEntries = visibleTeamMembers.map((member) => ({
    url: `${siteUrl}/our-team/${member.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...teamEntries]
}
