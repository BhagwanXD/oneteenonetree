"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { slugify } from '@/lib/gallery'
import type { Insight } from '@/lib/insights'

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: initialInsight?.content ?? emptyDoc,
  })

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

  const buildPayload = (nextStatus: Insight['status']) => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const now = new Date().toISOString()
    return {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: editor?.getJSON() ?? emptyDoc,
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
    if (!editor) {
      setNotice('Editor is still loading.')
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

  const addLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl || '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

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
              <label className="text-sm text-white/70">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={3}
                placeholder="Short summary for cards and SEO"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Bullets
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={addLink}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                Link
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[240px] focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-500/30">
              <EditorContent editor={editor} className="insights-prose insight-editor" />
            </div>
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
              <span className="text-white/80">{formatDateTime(initialInsight?.published_at ?? null)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated</span>
              <span className="text-white/80">{formatDateTime(initialInsight?.updated_at ?? null)}</span>
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
