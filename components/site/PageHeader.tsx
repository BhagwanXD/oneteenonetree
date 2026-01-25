import React from 'react'

export type PageHeaderProps = {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  align?: 'center' | 'left'
  size?: 'default' | 'hero'
  titleClassName?: string
  descriptionClassName?: string
  containerClassName?: string
}

export default function PageHeader({
  title,
  description,
  icon,
  actions,
  align = 'center',
  size = 'default',
  titleClassName,
  descriptionClassName,
  containerClassName,
}: PageHeaderProps) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center'
  const titleWrapper = align === 'left' ? 'justify-start' : 'justify-center'
  const isHero = size === 'hero'
  const padding = isHero ? 'py-20 sm:py-24 lg:py-28' : 'py-12'
  const headingClass = isHero
    ? 'text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]'
    : 'text-4xl md:text-5xl font-semibold tracking-tight'
  const descriptionClass = isHero ? 'text-lg md:text-xl text-white/75' : 'text-base md:text-lg text-white/70'

  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1100px_420px_at_50%_0%,rgba(0,208,132,0.16),transparent_70%),radial-gradient(900px_360px_at_15%_10%,rgba(0,255,200,0.12),transparent_65%),radial-gradient(900px_360px_at_85%_12%,rgba(0,180,120,0.1),transparent_65%),linear-gradient(180deg,rgba(12,22,17,0.35),rgba(11,21,16,0.6))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[var(--bg)]" />
      <div className={`relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${padding} ${containerClassName ?? ''}`}>
        <div className={`flex flex-col gap-4 ${alignment}`}>
          <div className={`flex items-center gap-3 ${titleWrapper}`}>
            {icon ? (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--acc)]">
                {icon}
              </span>
            ) : null}
            <h1 className={`${headingClass} text-white ${titleClassName ?? ''}`}>
              {title}
            </h1>
          </div>
          {description ? (
            <p
              className={`${descriptionClass} ${
                align === 'center' ? 'mx-auto text-center max-w-3xl' : 'max-w-3xl'
              } ${descriptionClassName ?? ''}`}
            >
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className={`flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
