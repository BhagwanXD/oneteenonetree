import { parseStringPromise } from 'xml2js'

export type BlogItem = {
  title: string
  link: string
  pubDate?: string
  description?: string
}

export async function fetchRssFeed(url: string): Promise<BlogItem[]> {
  const ctrl = new AbortController()
  // Fail fast if the upstream is slow; keep homepage snappy
  const timeout = setTimeout(() => ctrl.abort(), 1500)
  try {
    const res = await fetch(url, { next: { revalidate: 300 }, signal: ctrl.signal })
    if(!res.ok) throw new Error('Failed to fetch RSS')
    const xml = await res.text()
    const data = await parseStringPromise(xml, { explicitArray: false })
    const items = data?.rss?.channel?.item ?? []
    const arr = Array.isArray(items) ? items : [items]
    return arr.filter(Boolean).map((i:any) => ({
      title: i.title,
      link: i.link,
      pubDate: i.pubDate,
      description: typeof i.description === 'string' ? i.description.replace(/<[^>]*>/g,'') : ''
    }))
  } finally {
    clearTimeout(timeout)
  }
}
