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
]
