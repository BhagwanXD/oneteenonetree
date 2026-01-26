"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { slugify } from '@/lib/gallery'
import { sanitizeInsightHtml, tiptapToMarkdown, wrapInsightTables, type Insight } from '@/lib/insights'

type InsightEditorProps = {
  initialInsight?: Partial<Insight>
  defaultAuthorName?: string | null
}

const emptyDoc = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [] }],
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function InsightEditor({ initialInsight, defaultAuthorName }: InsightEditorProps) {
  const router = useRouter()
  const { push, replace } = useNavigateWithLoader()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [title, setTitle] = useState(initialInsight?.title ?? '')
  const [slug, setSlug] = useState(initialInsight?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initialInsight?.slug))
  const [excerpt, setExcerpt] = useState(initialInsight?.excerpt ?? '')
  const [contentFormat, setContentFormat] = useState<Insight['content_format']>(
    initialInsight?.content_format ?? (initialInsight?.content_html ? 'html' : 'md')
  )
  const [contentMd, setContentMd] = useState(() => {
    const fromMd = initialInsight?.content_md
    if (typeof fromMd === 'string') return fromMd
    if (initialInsight?.content) return tiptapToMarkdown(initialInsight.content)
    return ''
  })
  const [contentHtml, setContentHtml] = useState(initialInsight?.content_html ?? '')
  const [htmlPreview, setHtmlPreview] = useState('')
  const [htmlWarning, setHtmlWarning] = useState('')
  const [formatWarning, setFormatWarning] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState(initialInsight?.cover_image_url ?? '')
  const [status, setStatus] = useState<Insight['status']>(
    (initialInsight?.status as Insight['status']) ?? 'draft'
  )
  const [authorName, setAuthorName] = useState(
    initialInsight?.author_name ?? defaultAuthorName ?? ''
  )
  const [tagsInput, setTagsInput] = useState((initialInsight?.tags ?? []).join(', '))
  const [metaTitle, setMetaTitle] = useState(initialInsight?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(initialInsight?.meta_description ?? '')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [slugError, setSlugError] = useState('')
  const [uploading, setUploading] = useState(false)
  const insightId = initialInsight?.id ?? null

  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const htmlRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title))
    }
  }, [title, slugTouched])

  useEffect(() => {
    if (!slug.trim()) {
      setSlugStatus('idle')
      setSlugError('')
      return
    }
    setSlugStatus('checking')
    const handle = window.setTimeout(async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('id')
        .eq('slug', slug.trim())
        .maybeSingle()
      if (error) {
        setSlugStatus('idle')
        return
      }
      if (data && data.id !== insightId) {
        setSlugStatus('taken')
        setSlugError('Slug already in use.')
      } else {
        setSlugStatus('available')
        setSlugError('')
      }
    }, 350)
    return () => window.clearTimeout(handle)
  }, [slug, insightId, supabase])

  const handleUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, '-').toLowerCase()
    const path = `${insightId ?? 'draft'}/${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from('insights').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (!error) {
      const { data } = supabase.storage.from('insights').getPublicUrl(path)
      setCoverImageUrl(data.publicUrl)
    }
    setUploading(false)
  }

  const insertAtCursor = (snippet: string, cursorOffset?: number) => {
    const textarea = contentRef.current
    if (!textarea) {
      setContentMd((prev: string) => `${prev}${snippet}`)
      return
    }
    const start = textarea.selectionStart ?? contentMd.length
    const end = textarea.selectionEnd ?? contentMd.length
    const before = contentMd.slice(0, start)
    const after = contentMd.slice(end)
    const next = `${before}${snippet}${after}`
    setContentMd(next)
    requestAnimationFrame(() => {
      textarea.focus()
      const nextPos = start + (cursorOffset ?? snippet.length)
      textarea.setSelectionRange(nextPos, nextPos)
    })
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    insertAtCursor(text)
  }

  const insertHtmlAtCursor = (snippet: string, cursorOffset?: number) => {
    const textarea = htmlRef.current
    if (!textarea) {
      setContentHtml((prev: string) => `${prev}${snippet}`)
      return
    }
    const start = textarea.selectionStart ?? contentHtml.length
    const end = textarea.selectionEnd ?? contentHtml.length
    const before = contentHtml.slice(0, start)
    const after = contentHtml.slice(end)
    const next = `${before}${snippet}${after}`
    setContentHtml(next)
    requestAnimationFrame(() => {
      textarea.focus()
      const nextPos = start + (cursorOffset ?? snippet.length)
      textarea.setSelectionRange(nextPos, nextPos)
    })
  }

  const handleHtmlPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const html = event.clipboardData.getData('text/html')
    const plain = event.clipboardData.getData('text/plain')
    insertHtmlAtCursor(html || plain)
  }

  const getSanitizedHtml = () => {
    const cleaned = sanitizeInsightHtml(contentHtml)
    if (contentHtml.trim() && !cleaned.trim()) {
      setHtmlWarning('Your HTML contained unsupported tags. Please use allowed tags only.')
    } else {
      setHtmlWarning('')
    }
    return cleaned
  }

  const handleSanitizePreview = () => {
    const cleaned = getSanitizedHtml()
    setHtmlPreview(wrapInsightTables(cleaned))
  }

  const insertLink = () => {
    const snippet = '[link text](https://example.com)'
    insertAtCursor(snippet, snippet.length - 'https://example.com)'.length)
  }

  const buildPayload = (nextStatus: Insight['status']) => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const now = new Date().toISOString()
    const nextFormat = contentFormat ?? 'md'
    const cleanedHtml = nextFormat === 'html' ? getSanitizedHtml() : null
    return {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: emptyDoc,
      content_md: nextFormat === 'md' ? contentMd.trim() : null,
      content_html: cleanedHtml?.trim() || null,
      content_format: nextFormat,
      cover_image_url: coverImageUrl || null,
      status: nextStatus,
      author_name: authorName.trim() || null,
      tags: tags.length ? tags : null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      published_at: nextStatus === 'published' ? initialInsight?.published_at ?? now : null,
    }
  }

  const handleSave = async (nextStatus: Insight['status']) => {
    setNotice('')
    if (!title.trim()) {
      setNotice('Title is required.')
      return
    }
    if (!slug.trim()) {
      setNotice('Slug is required.')
      return
    }
    if (slugStatus === 'taken') {
      setNotice('Slug must be unique.')
      return
    }
    if (contentFormat === 'html') {
      const cleaned = getSanitizedHtml()
      if (!cleaned.trim()) {
        setNotice('Your HTML contained unsupported tags. Please use allowed tags only.')
        return
      }
      setContentHtml(cleaned)
      setHtmlPreview(wrapInsightTables(cleaned))
    } else if (!contentMd.trim()) {
      setNotice('Content cannot be empty.')
      return
    }

    setSaving(true)
    const payload = buildPayload(nextStatus)
    let error = null

    if (insightId) {
      const res = await supabase.from('insights').update(payload).eq('id', insightId)
      error = res.error
    } else {
      const res = await supabase.from('insights').insert(payload).select('id,slug').maybeSingle()
      error = res.error
      if (!error && res.data?.id) {
        replace(`/admin/insights/${res.data.id}/edit`)
      }
    }

    if (error) {
      setNotice(error.message)
    } else {
      setStatus(nextStatus)
      setNotice(nextStatus === 'published' ? 'Insight published.' : 'Draft saved.')
      router.refresh()
    }
    setSaving(false)
  }

  const handleUnpublish = async () => {
    if (!insightId) return
    setSaving(true)
    const { error } = await supabase
      .from('insights')
      .update({ status: 'draft', published_at: null })
      .eq('id', insightId)
    if (error) {
      setNotice(error.message)
    } else {
      setStatus('draft')
      setNotice('Insight moved back to draft.')
      router.refresh()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!insightId) return
    if (!confirm('Delete this insight? This cannot be undone.')) return
    setSaving(true)
    const { error } = await supabase.from('insights').delete().eq('id', insightId)
    if (error) {
      setNotice(error.message)
      setSaving(false)
      return
    }
    push('/admin/insights')
  }

  const excerptLength = excerpt.trim().length
  const excerptHint = excerptLength > 180 ? 'Aim for 160–180 characters.' : 'Suggested 160–180 characters.'

  return (
    <div className="container py-8 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {insightId ? 'Edit Insight' : 'Create Insight'}
          </h1>
          <p className="text-sm text-white/60">
            Draft and publish insights for the OneTeenOneTree community.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {insightId && status === 'published' ? (
            <a
              href={`/insights/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Preview
            </a>
          ) : null}
          {status === 'published' ? (
            <>
              <button onClick={() => handleSave('published')} className="btn" disabled={saving}>
                Update
              </button>
              <button onClick={handleUnpublish} className="btn" disabled={saving}>
                Unpublish
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleSave('draft')} className="btn" disabled={saving}>
                Save draft
              </button>
              <button onClick={() => handleSave('published')} className="btn" disabled={saving}>
                Publish
              </button>
            </>
          )}
        </div>
      </header>

      {notice ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {notice}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-6">
          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Title *</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Insight title"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Slug *</label>
              <input
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  setSlug(event.target.value)
                }}
                placeholder="insight-slug"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
              <div className="text-xs text-white/50">
                {slugStatus === 'checking'
                  ? 'Checking slug...'
                  : slugStatus === 'taken'
                    ? slugError
                    : slugStatus === 'available' && slug
                      ? 'Slug is available.'
                      : ''}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">Excerpt</label>
                <span className={`text-xs ${excerptLength > 180 ? 'text-amber-200' : 'text-white/40'}`}>
                  {excerptLength}/180
                </span>
              </div>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={3}
                placeholder="Short summary for cards and SEO"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-white/40">{excerptHint}</p>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {contentFormat === 'md' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => insertAtCursor('\n## Heading\n')}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor('\n### Subheading\n')}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor('\n- Item 1\n- Item 2\n')}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      Bullets
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor('\n1. First item\n2. Second item\n')}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      Numbered
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor('\n---\n')}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      Divider
                    </button>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertAtCursor(
                          '\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n'
                        )
                      }
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      Table
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleSanitizePreview}
                    className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 hover:bg-emerald-500/20 transition"
                  >
                    Sanitize &amp; preview
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>Content format</span>
                <select
                  value={contentFormat ?? 'md'}
                  onChange={(event) => {
                    const next = event.target.value as 'md' | 'html'
                    const switchingToHtml = next === 'html'
                    const switchingToMd = next === 'md'
                    const hasMd = contentMd.trim().length > 0
                    const hasHtml = contentHtml.trim().length > 0
                    if ((switchingToHtml && hasMd) || (switchingToMd && hasHtml)) {
                      setFormatWarning(
                        'Switching formats does not convert content. Saving will use only the selected format.'
                      )
                    } else {
                      setFormatWarning('')
                    }
                    setContentFormat(next)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="md">Markdown</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
            {formatWarning ? (
              <p className="text-xs text-amber-200">{formatWarning}</p>
            ) : null}

            {contentFormat === 'html' ? (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[240px] focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-500/30">
                  <textarea
                    ref={htmlRef}
                    value={contentHtml}
                    onChange={(event) => setContentHtml(event.target.value)}
                    onPaste={handleHtmlPaste}
                    rows={16}
                    placeholder="Paste sanitized HTML here (headings, lists, tables)."
                    className="w-full bg-transparent text-sm text-white/80 outline-none resize-y min-h-[320px] font-mono"
                  />
                </div>
                <p className="text-xs text-white/50">
                  HTML is sanitized on save (scripts/styles removed, links forced to open in new tab).
                </p>
                {htmlWarning ? (
                  <p className="text-xs text-amber-200">{htmlWarning}</p>
                ) : null}
                {htmlPreview ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div
                      className="insights-prose"
                      dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[240px] focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-500/30">
                  <textarea
                    ref={contentRef}
                    value={contentMd}
                    onChange={(event) => setContentMd(event.target.value)}
                    onPaste={handlePaste}
                    rows={16}
                    placeholder="Write markdown content here. Paste as plain text to keep formatting clean."
                    className="w-full bg-transparent text-sm text-white/80 outline-none resize-y min-h-[320px]"
                  />
                </div>
                <p className="text-xs text-white/50">
                  Markdown only. HTML will be stripped on paste.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Cover image</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="Paste a public image URL"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleUpload(file)
                    }}
                  />
                  {uploading ? 'Uploading...' : 'Upload image'}
                </label>
                {coverImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="text-xs text-white/60 hover:text-white transition"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            {coverImageUrl ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                <img
                  src={coverImageUrl}
                  alt="Insight cover preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
            ) : null}
          </div>

          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Author</label>
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="Author name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Tags</label>
              <input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="climate, students, verification"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-white/80">SEO settings</h3>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Meta title</label>
              <input
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                placeholder="Optional SEO title"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Meta description</label>
              <textarea
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                rows={3}
                placeholder="Optional SEO description"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="card space-y-2 text-sm text-white/60">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-white/80">{status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Published</span>
              <span className="text-white/80">
                {formatDateTime(initialInsight?.published_at ?? null)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated</span>
              <span className="text-white/80">
                {formatDateTime(initialInsight?.updated_at ?? null)}
              </span>
            </div>
          </div>

          {insightId ? (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 transition"
              disabled={saving}
            >
              Delete insight
            </button>
          ) : null}
        </div>
      </section>
    </div>
  )
}
