import type { Metadata } from 'next'

export const siteUrl = 'https://oneteenonetree.org'

export const defaultDescription =
  'OneTeenOneTree empowers students worldwide to take climate action by pledging to plant and care for trees - inspiring a generation of eco-conscious youth.'

export const defaultOgImage = `${siteUrl}/og.png`

const formatTitle = (title: string) =>
  title.includes('OneTeenOneTree') ? title : `${title} | OneTeenOneTree`

export const buildMetadata = ({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata => {
  const resolvedDescription = description ?? defaultDescription
  const canonical = path ? `${siteUrl}${path}` : `${siteUrl}/`
  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : defaultOgImage
  const formattedTitle = formatTitle(title)

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: formattedTitle,
      description: resolvedDescription,
      url: canonical,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
    },
    twitter: {
      title: formattedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
