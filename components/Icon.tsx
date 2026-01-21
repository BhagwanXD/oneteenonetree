import type { SVGProps } from 'react'
import { iconMap, type IconName } from './icons'

type IconProps = {
  name: IconName
  size?: number
  title?: string
  ariaLabel?: string
} & Omit<SVGProps<SVGSVGElement>, 'children'>

export default function Icon({ name, size = 20, title, ariaLabel, ...rest }: IconProps) {
  const Svg = iconMap[name]
  if (!Svg) return null

  const ariaProps = ariaLabel
    ? { 'aria-label': ariaLabel, role: 'img' as const }
    : { 'aria-hidden': true, role: 'presentation' as const }

  return (
    <Svg
      width={size}
      height={size}
      focusable="false"
      {...ariaProps}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
    </Svg>
  )
}
