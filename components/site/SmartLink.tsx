'use client'

import Link, { type LinkProps } from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'

type SmartLinkProps = LinkProps & {
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  children: ReactNode
  prefetch?: boolean
}

export default function SmartLink({
  children,
  onClick,
  href,
  prefetch,
  className,
  ...props
}: SmartLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      onClick={(event) => {
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
