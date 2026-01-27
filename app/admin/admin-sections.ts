export type AdminSection = {
  title: string
  navLabel: string
  href: string
  description: string
  icon: 'checklist' | 'settings' | 'mail' | 'upload' | 'article'
}

export const adminSections: AdminSection[] = [
  {
    title: 'Review submissions',
    navLabel: 'Review',
    href: '/admin/review',
    description: 'Approve, reject, or request more proof for plantings.',
    icon: 'checklist',
  },
  {
    title: 'Social manager',
    navLabel: 'Social',
    href: '/admin/social',
    description: 'Create, edit, and sync posts across social channels.',
    icon: 'settings',
  },
  {
    title: 'Contact submissions',
    navLabel: 'Contact',
    href: '/admin/contact',
    description: 'Review and respond to contact form messages.',
    icon: 'mail',
  },
  {
    title: 'Gallery manager',
    navLabel: 'Gallery',
    href: '/admin/gallery',
    description: 'Upload and organize public gallery photos.',
    icon: 'upload',
  },
  {
    title: 'Insights manager',
    navLabel: 'Insights',
    href: '/admin/insights',
    description: 'Create, edit, and publish insights articles.',
    icon: 'article',
  },
  {
    title: 'Insights SEO map',
    navLabel: 'SEO Map',
    href: '/admin/insights/seo-map',
    description: 'Manage internal link mappings for published insights.',
    icon: 'settings',
  },
]
