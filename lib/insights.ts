import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

export type Insight = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: Record<string, unknown> | string
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
  if (!value) return defaultDoc
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return defaultDoc
    try {
      let parsed: unknown = JSON.parse(trimmed)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, unknown>
      }
    } catch {}
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: trimmed }],
        },
      ],
    }
  }
  return value
}

export const renderInsightContent = (value: Insight['content']) => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      return trimmed
    }
  }
  const doc = normalizeInsightContent(value)
  return generateHTML(doc, [StarterKit, Link])
}

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
