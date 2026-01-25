import React from 'react'
import Reveal from '@/components/Reveal'

type PageShellProps = {
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
  innerClassName?: string
  useContainer?: boolean
}

export default function PageShell({
  header,
  children,
  className,
  innerClassName,
  useContainer = true,
}: PageShellProps) {
  const wrapperClass = useContainer ? 'container' : ''
  const contentOffset = header ? 'mt-10' : ''
  const wrappedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    const isSection = typeof child.type === 'string' && child.type === 'section'
    if (!isSection) return child
    return (
      <Reveal key={child.key ?? index}>
        {child}
      </Reveal>
    )
  })
  return (
    <div className={className ?? ''}>
      {header}
      <div className={`${wrapperClass} pb-16 space-y-10 ${contentOffset} ${innerClassName ?? ''}`}>
        {wrappedChildren}
      </div>
    </div>
  )
}
