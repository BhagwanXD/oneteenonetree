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

export type OpenGraphPreview = {
  title?: string
  description?: string
  imageUrl?: string
}

export const fetchOpenGraph = async (url: string): Promise<OpenGraphPreview> => {
  if (!isSafeUrl(url)) return {}

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

    const title = extractMeta(html, 'og:title') || extractTitle(html)
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description')
    const imageUrl = extractMeta(html, 'og:image')

    return {
      title: title || undefined,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
    }
  } catch {
    return {}
  } finally {
    clearTimeout(timeout)
  }
}
