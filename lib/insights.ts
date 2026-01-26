import sanitizeHtml from 'sanitize-html'

export type Insight = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: Record<string, unknown> | string
  content_md?: string | null
  content_html?: string | null
  content_format?: 'md' | 'html'
  cover_image_url: string | null
  status: 'draft' | 'published'
  author_name: string | null
  tags: string[] | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

const defaultDoc = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [] }],
}

export const normalizeInsightContent = (value: Insight['content']) => {
  if (!value || typeof value === 'string') return defaultDoc
  return value
}

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')

const renderInline = (nodes?: any[]): string => {
  if (!nodes?.length) return ''
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        let text = node.text ?? ''
        const marks = node.marks ?? []
        marks.forEach((mark: any) => {
          if (mark.type === 'bold') text = `**${text}**`
          if (mark.type === 'italic') text = `*${text}*`
          if (mark.type === 'link' && mark.attrs?.href) text = `[${text}](${mark.attrs.href})`
        })
        return text
      }
      if (node.type === 'hardBreak') return '\n'
      return renderInline(node.content)
    })
    .join('')
}

const renderBlock = (node: any, index = 0): string => {
  if (!node) return ''
  switch (node.type) {
    case 'heading': {
      const level = Math.min(Math.max(node.attrs?.level ?? 2, 1), 3)
      const prefix = '#'.repeat(level)
      return `${prefix} ${renderInline(node.content)}`
    }
    case 'paragraph':
      return renderInline(node.content)
    case 'bulletList':
      return (node.content ?? [])
        .map((item: any) => `- ${renderBlock(item)}`)
        .join('\n')
    case 'orderedList':
      return (node.content ?? [])
        .map((item: any, i: number) => `${i + 1}. ${renderBlock(item, i)}`)
        .join('\n')
    case 'listItem': {
      const paragraph = (node.content ?? []).find((child: any) => child.type === 'paragraph')
      return renderInline(paragraph?.content ?? node.content)
    }
    case 'blockquote':
      return (node.content ?? [])
        .map((child: any) => `> ${renderBlock(child)}`)
        .join('\n')
    default:
      return renderInline(node.content)
  }
}

export const tiptapToMarkdown = (value: Insight['content']) => {
  if (typeof value === 'string') return stripHtml(value).trim()
  const doc = normalizeInsightContent(value) as any
  if (!doc?.content?.length) return ''
  return doc.content.map((node: any, index: number) => renderBlock(node, index)).join('\n\n')
}

export const sanitizeInsightHtml = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'code',
      'pre',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  })

export const wrapInsightTables = (value: string) =>
  value
    .replace(/<table\b/gi, '<div class="table-wrap"><table')
    .replace(/<\/table>/gi, '</table></div>')

export const formatInsightDate = (value?: string | null) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
