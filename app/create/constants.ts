import type { PosterSize } from './types'

export const SIZE_OPTIONS: Array<{
  value: PosterSize
  label: string
  width: number
  height: number
}> = [
  { value: 'square', label: 'Square 1080 x 1080', width: 1080, height: 1080 },
  { value: 'portrait', label: 'Poster 1080 x 1350', width: 1080, height: 1350 },
  { value: 'story', label: 'Story 1080 x 1920', width: 1080, height: 1920 },
]

export const LOCKED_COPY = {
  title: 'OneTeenOneTree',
  subtitle: 'One pledge. One tree. One future.',
  description:
    'A youth-led movement turning pledges into real trees through community action.',
}

export const BRAND_STYLE = {
  accent: '#00d084',
  gradient: ['#0f2a1d', '#0b1510'] as [string, string],
}

export const SDG_ICONS = ['6', '7', '11', '12', '13', '15', '17']

export const SDG_ICON_PATHS = SDG_ICONS.map((number) => `/sdgs/sdg-${number}.svg`)

export const UN_LOGO_CANDIDATES = ['/brand/un-logo.svg', '/brand/un-logo.png']
