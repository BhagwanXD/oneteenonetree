'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminSections } from './admin-sections'

const baseClass =
  'inline-flex items-center rounded-xl px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]'
const activeClass = 'bg-white/10 text-white'
const inactiveClass = 'text-white/70 hover:text-white hover:bg-white/5'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  ...adminSections.map((section) => ({
    label: section.navLabel,
    href: section.href,
  })),
]

export default function AdminNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname.startsWith(href)

  return (
    <nav
      aria-label="Admin"
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2"
    >
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`${baseClass} ${active ? activeClass : inactiveClass}`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
