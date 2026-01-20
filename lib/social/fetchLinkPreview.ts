const MAX_BYTES = 1_000_000
const TIMEOUT_MS = 8000

const isPrivateHostname = (hostname: string) => {
  const lower = hostname.toLowerCase()
  if (lower === 'localhost' || lower.endsWith('.local') || lower.endsWith('.internal')) return true
  if (lower === '127.0.0.1' || lower === '0.0.0.0' || lower === '::1') return true
  if (/^10\.\d+\.\d+\.\d+$/.test(lower)) return true
  if (/^192\.168\.\d+\.\d+$/.test(lower)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(lower)) return true
  if (/^169\.254\.\d+\.\d+$/.test(lower)) return true
  if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80:')) return true
  return false
}

const isSafeUrl = (value: string) => {
  try {
    const parsed = new URL(value)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    if (isPrivateHostname(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

const readLimitedText = async (response: Response) => {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder('utf-8')
  let result = ''
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      total += value.length
      if (total > MAX_BYTES) {
        reader.cancel()
        throw new Error('Response too large')
      }
      result += decoder.decode(value, { stream: true })
    }
  }
  result += decoder.decode()
  return result
}

const extractMeta = (html: string, property: string) => {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i'
  )
  const match = html.match(pattern)
  return match?.[1]?.trim() || ''
}

const extractTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match?.[1]?.trim() || ''
}

const resolveUrl = (value: string, baseUrl?: string) => {
  if (!value) return ''
  try {
    return baseUrl ? new URL(value, baseUrl).toString() : new URL(value).toString()
  } catch {
    return value
  }
}

const parseDate = (value?: string | null) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

const findJsonLdDate = (value: unknown): string | null => {
  if (!value) return null
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = findJsonLdDate(entry)
      if (found) return found
    }
    return null
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = ['datePublished', 'dateCreated', 'uploadDate', 'dateModified']
    for (const key of keys) {
      if (typeof obj[key] === 'string') {
        const parsed = parseDate(obj[key] as string)
        if (parsed) return parsed
      }
    }
    if (Array.isArray(obj['@graph'])) {
      const found = findJsonLdDate(obj['@graph'])
      if (found) return found
    }
    if (obj.mainEntity) {
      const found = findJsonLdDate(obj.mainEntity)
      if (found) return found
    }
  }
  return null
}

const extractJsonLdDate = (html: string) => {
  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )
  for (const match of matches) {
    const jsonText = match[1]?.trim()
    if (!jsonText) continue
    try {
      const parsed = JSON.parse(jsonText)
      const date = findJsonLdDate(parsed)
      if (date) return date
    } catch {
      continue
    }
  }
  return null
}

const extractPostDate = (html: string) => {
  const candidates = [
    extractMeta(html, 'article:published_time'),
    extractMeta(html, 'og:published_time'),
    extractMeta(html, 'article:modified_time'),
    extractMeta(html, 'og:updated_time'),
    extractMeta(html, 'publish_date'),
  ].filter(Boolean)
  for (const value of candidates) {
    const parsed = parseDate(value)
    if (parsed) return parsed
  }
  return extractJsonLdDate(html)
}

export type LinkPreview = {
  title?: string
  description?: string
  imageUrl?: string
  postDate?: string | null
}

export const getSocialPlaceholder = (platform?: 'instagram' | 'linkedin') => {
  if (platform === 'instagram') return '/images/social/instagram-placeholder.jpg'
  if (platform === 'linkedin') return '/images/social/linkedin-placeholder.jpg'
  return '/images/social/instagram-placeholder.jpg'
}

export const fetchLinkPreview = async (
  url: string,
  platform?: 'instagram' | 'linkedin'
): Promise<LinkPreview> => {
  if (!isSafeUrl(url)) {
    return {}
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'OneTeenOneTreeBot/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!response.ok) return {}
    if (!response.url || !isSafeUrl(response.url)) return {}

    const contentLength = response.headers.get('content-length')
    if (contentLength && Number(contentLength) > MAX_BYTES) return {}

    const html = await readLimitedText(response)
    if (!html) return {}

    const title =
      extractMeta(html, 'og:title') ||
      extractMeta(html, 'twitter:title') ||
      extractTitle(html)
    const description =
      extractMeta(html, 'og:description') ||
      extractMeta(html, 'twitter:description') ||
      extractMeta(html, 'description')
    const rawImage =
      extractMeta(html, 'og:image') ||
      extractMeta(html, 'og:image:secure_url') ||
      extractMeta(html, 'twitter:image') ||
      extractMeta(html, 'twitter:image:src')
    const imageUrl = rawImage ? resolveUrl(rawImage, response.url) : undefined
    const postDate = extractPostDate(html)

    return {
      title: title || undefined,
      description: description || undefined,
      imageUrl,
      postDate,
    }
  } catch {
    return {}
  } finally {
    clearTimeout(timeout)
  }
}
