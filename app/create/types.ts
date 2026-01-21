export type PosterTemplate = 'impact' | 'volunteer' | 'drive' | 'thankyou' | 'onetree'
export type PosterSize = 'square' | 'portrait' | 'story'
export type BackgroundStyle = 'gradient' | 'photo' | 'solid'

export type PosterState = {
  template: PosterTemplate
  size: PosterSize
  background: BackgroundStyle
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  city: string
  date: string
  pledgeName: string
  pledgeChecked: boolean
}
