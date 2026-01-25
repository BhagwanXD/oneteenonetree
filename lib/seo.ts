import type { Metadata } from 'next'

export const siteUrl = 'https://oneteenonetree.org'

export const defaultDescription =
  'OneTeenOneTree is a youth-led environmental initiative and climate action movement turning pledges into real trees through verified community drives in India.'

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
      card: 'summary_large_image',
      title: formattedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
