export type AdminSection = {
  title: string
  navLabel: string
  href: string
  description: string
}

export const adminSections: AdminSection[] = [
  {
    title: 'Review submissions',
    navLabel: 'Review',
    href: '/admin/review',
    description: 'Approve, reject, or request more proof for plantings.',
  },
  {
    title: 'Social manager',
    navLabel: 'Social',
    href: '/admin/social',
    description: 'Create, edit, and sync posts across social channels.',
  },
  {
    title: 'Contact submissions',
    navLabel: 'Contact',
    href: '/admin/contact',
    description: 'Review and respond to contact form messages.',
  },
  {
    title: 'Gallery manager',
    navLabel: 'Gallery',
    href: '/admin/gallery',
    description: 'Upload and organize public gallery photos.',
  },
]
