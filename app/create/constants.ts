import type { PosterSize, PosterTemplate, BackgroundStyle } from './types'

export const TEMPLATE_OPTIONS: Array<{
  value: PosterTemplate
  label: string
  description: string
}> = [
  {
    value: 'impact',
    label: 'Impact Card',
    description: 'Share milestones and verified progress.',
  },
  {
    value: 'volunteer',
    label: 'Volunteer Call',
    description: 'Invite students to join local drives.',
  },
  {
    value: 'drive',
    label: 'Drive Highlight',
    description: 'Spotlight a recent plantation drive.',
  },
  {
    value: 'thankyou',
    label: 'Thank You / Appreciation',
    description: 'Celebrate partners and supporters.',
  },
  {
    value: 'onetree',
    label: 'OneTeenOneTree = One Tree (Story)',
    description: 'Simple story template for pledges.',
  },
]

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

export const BACKGROUND_OPTIONS: Array<{
  value: BackgroundStyle
  label: string
}> = [
  { value: 'gradient', label: 'Gradient' },
  { value: 'photo', label: 'Photo' },
  { value: 'solid', label: 'Solid' },
]

export const TEMPLATE_STYLES: Record<
  PosterTemplate,
  { accent: string; gradient: [string, string]; glow: string }
> = {
  impact: {
    accent: '#00d084',
    gradient: ['#0f2a1d', '#0b1510'],
    glow: 'rgba(0, 208, 132, 0.22)',
  },
  volunteer: {
    accent: '#8cf2c8',
    gradient: ['#0e251a', '#0b1510'],
    glow: 'rgba(140, 242, 200, 0.2)',
  },
  drive: {
    accent: '#00c58a',
    gradient: ['#0f251b', '#0b1510'],
    glow: 'rgba(0, 197, 138, 0.2)',
  },
  thankyou: {
    accent: '#b6f2d6',
    gradient: ['#10281c', '#0b1510'],
    glow: 'rgba(182, 242, 214, 0.18)',
  },
  onetree: {
    accent: '#00d084',
    gradient: ['#0f2a1d', '#0b1510'],
    glow: 'rgba(0, 208, 132, 0.22)',
  },
}
