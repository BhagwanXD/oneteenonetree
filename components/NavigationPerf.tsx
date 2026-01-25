'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const isDev = process.env.NODE_ENV !== 'production'

declare global {
  interface Window {
    __navClickTime?: number
    __navClickHref?: string
  }
}

export const markNavClick = (href: string) => {
  if (!isDev || typeof window === 'undefined' || !('performance' in window)) return
  window.__navClickTime = performance.now()
  window.__navClickHref = href
  try {
    performance.mark('nav_click')
    performance.mark('route_change_start')
  } catch {}
}

export default function NavigationPerf() {
  const pathname = usePathname()
  const previous = useRef(pathname)

  useEffect(() => {
    if (!isDev) return
    if (previous.current === pathname) return
    const end = performance.now()
    try {
      performance.mark('route_change_complete')
      performance.measure('nav_to_route', 'nav_click', 'route_change_complete')
    } catch {}
    const start = window.__navClickTime
    if (start) {
      const duration = end - start
      console.log(
        `[nav] ${window.__navClickHref ?? ''} -> ${pathname} in ${duration.toFixed(0)}ms`
      )
    } else {
      console.log(`[nav] route change -> ${pathname}`)
    }
    window.__navClickTime = undefined
    window.__navClickHref = undefined
    previous.current = pathname
  }, [pathname])

  return null
}
