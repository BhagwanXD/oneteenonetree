export type NavVisibility = 'public' | 'auth' | 'role'
export type NavSection = 'explore' | 'community' | 'resources'
export type NavDesktopGroup = 'primary' | 'more'

export type NavItem = {
  label: string
  href: string
  section: NavSection
  desktop: NavDesktopGroup
  visibility: NavVisibility
  requiredRoles?: string[]
}

export type AccountNavItem = {
  label: string
  href: string
  visibility: Exclude<NavVisibility, 'public'>
  requiredRoles?: string[]
}

export const publicNavItems: NavItem[] = [
  { label: 'Home', href: '/', section: 'explore', desktop: 'primary', visibility: 'public' },
  { label: 'About', href: '/about', section: 'explore', desktop: 'primary', visibility: 'public' },
  {
    label: 'Our Team',
    href: '/our-team',
    section: 'explore',
    desktop: 'more',
    visibility: 'public',
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    section: 'explore',
    desktop: 'more',
    visibility: 'public',
  },
  { label: 'Pledge', href: '/pledge', section: 'community', desktop: 'primary', visibility: 'public' },
  { label: 'Plant', href: '/plant', section: 'community', desktop: 'primary', visibility: 'public' },
  { label: 'Donate', href: '/donate', section: 'community', desktop: 'primary', visibility: 'public' },
  { label: 'Social', href: '/social', section: 'community', desktop: 'more', visibility: 'public' },
  { label: 'Gallery', href: '/gallery', section: 'community', desktop: 'more', visibility: 'public' },
  { label: 'Blog', href: '/blog', section: 'resources', desktop: 'more', visibility: 'public' },
  { label: 'Press', href: '/press', section: 'resources', desktop: 'more', visibility: 'public' },
  { label: 'FAQ', href: '/faq', section: 'resources', desktop: 'more', visibility: 'public' },
  { label: 'Contact', href: '/contact', section: 'resources', desktop: 'more', visibility: 'public' },
  { label: 'Create', href: '/create', section: 'resources', desktop: 'more', visibility: 'public' },
  { label: 'Games', href: '/games', section: 'resources', desktop: 'more', visibility: 'public' },
]

export const accountNavItems: AccountNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', visibility: 'auth' },
  { label: 'Admin', href: '/admin', visibility: 'role', requiredRoles: ['admin'] },
  { label: 'Debug', href: '/debug/auth', visibility: 'role', requiredRoles: ['admin'] },
]

export const filterAccountItems = ({
  items,
  isAuthed,
  role,
}: {
  items: AccountNavItem[]
  isAuthed: boolean
  role?: string | null
}) =>
  items.filter((item) => {
    if (item.visibility === 'auth') return isAuthed
    if (item.visibility === 'role') return isAuthed && !!role && item.requiredRoles?.includes(role)
    return false
  })
