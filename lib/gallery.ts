const templateLabels: Record<string, string> = {
  onetree: 'OneTeenOneTree = One Tree',
}

export const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
  return slug
}

export const buildSeoCaption = ({
  template,
  title,
  city,
}: {
  template: string
  title: string
  city?: string | null
}) => {
  const label = templateLabels[template] ?? template
  const location = city ? ` Student-led climate action in ${city}.` : ' Student-led climate action across communities.'
  return `OneTeenOneTree ${label} poster: ${title}.${location} Join at oneteenonetree.org.`
}
