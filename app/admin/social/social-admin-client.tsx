'use client'

import { useEffect, useRef, useState } from 'react'
import { FaInstagram, FaLinkedin, FaSyncAlt, FaTrash } from 'react-icons/fa'
import { parseSocialCsv } from '@/lib/social/csv'

type SocialPost = {
  id: string
  platform: 'instagram' | 'linkedin'
  url: string
  title: string | null
  description: string | null
  image_url: string | null
  post_date: string | null
  created_at: string
  published: boolean
  source: 'manual' | 'auto'
}

type BulkFailure = {
  row: number
  reason: string
  url?: string
}

type BulkSummary = {
  total: number
  imported: number
  duplicates: number
  failed: BulkFailure[]
}

const platformMeta = {
  instagram: {
    label: 'Instagram',
    icon: <FaInstagram aria-hidden="true" />,
    badge: 'border-pink-500/40 bg-pink-600/20 text-pink-200',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: <FaLinkedin aria-hidden="true" />,
    badge: 'border-sky-500/40 bg-sky-600/20 text-sky-200',
  },
}

const toInputDate = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

export default function SocialAdminClient({
  initialPosts,
}: {
  initialPosts: SocialPost[]
}) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [form, setForm] = useState({
    url: '',
    platform: 'auto',
    title: '',
    postDate: '',
    published: true,
  })
  const [busyId, setBusyId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [bulkContent, setBulkContent] = useState<string>('')
  const [bulkPreview, setBulkPreview] = useState<
    { rowIndex: number; platform: string; url: string; title: string; postDate: string; published: string }[]
  >([])
  const [bulkCount, setBulkCount] = useState<number>(0)
  const [bulkError, setBulkError] = useState<string>('')
  const [bulkSummary, setBulkSummary] = useState<BulkSummary | null>(null)
  const [bulkPublishedDefault, setBulkPublishedDefault] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!bulkContent.trim()) {
      setBulkPreview([])
      setBulkCount(0)
      setBulkError('')
      return
    }
    if (bulkSummary) setBulkSummary(null)
    try {
      const parsed = parseSocialCsv(bulkContent)
      setBulkPreview(parsed.rows.slice(0, 10))
      setBulkCount(parsed.totalRows)
      if (parsed.totalRows > 200) {
        setBulkError('Limit is 200 rows per import.')
      } else {
        setBulkError('')
      }
    } catch {
      setBulkPreview([])
      setBulkCount(0)
      setBulkError('Could not parse CSV. Please check formatting.')
    }
  }, [bulkContent, bulkSummary])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('')
    setBusyId('new')
    const res = await fetch('/api/admin/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: form.url,
        platform: form.platform === 'auto' ? null : form.platform,
        title: form.title,
        postDate: form.postDate || null,
        published: form.published,
      }),
    })
    const payload = await res.json()
    setBusyId(null)
    if (!res.ok) {
      setStatus(payload.error || 'Failed to add post.')
      return
    }
    setPosts((prev) => [payload.post, ...prev])
    setForm({ url: '', platform: 'auto', title: '', postDate: '', published: true })
    setStatus('Post added.')
  }

  const handleUpdate = async (post: SocialPost) => {
    setStatus('')
    setBusyId(post.id)
    const res = await fetch('/api/admin/social', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: post.id,
        title: post.title ?? '',
        postDate: post.post_date ?? '',
        published: post.published,
      }),
    })
    const payload = await res.json()
    setBusyId(null)
    if (!res.ok) {
      setStatus(payload.error || 'Failed to update post.')
      return
    }
    setPosts((prev) => prev.map((row) => (row.id === post.id ? payload.post : row)))
    setStatus('Post updated.')
  }

  const handleDelete = async (id: string) => {
    setStatus('')
    setBusyId(id)
    const res = await fetch('/api/admin/social', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setBusyId(null)
    if (!res.ok) {
      const payload = await res.json()
      setStatus(payload.error || 'Failed to delete post.')
      return
    }
    setPosts((prev) => prev.filter((row) => row.id !== id))
    setStatus('Post removed.')
  }

  const handleSync = async () => {
    setStatus('')
    setBusyId('sync')
    const res = await fetch('/api/admin/social/sync', { method: 'POST' })
    const payload = await res.json()
    setBusyId(null)
    if (!res.ok) {
      setStatus(payload.error || 'Sync failed.')
      return
    }
    setStatus(
      `Sync complete. Instagram: ${payload.instagram?.imported ?? 0} | LinkedIn: ${
        payload.linkedin?.imported ?? 0
      }`
    )
  }

  const handleBulkFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setBulkError('Please upload a .csv file.')
      return
    }
    const text = await file.text()
    setBulkContent(text)
    setBulkSummary(null)
  }

  const handleBulkImport = async () => {
    setBulkSummary(null)
    if (!bulkContent.trim()) {
      setBulkError('Upload a CSV file or paste URLs first.')
      return
    }
    if (bulkCount === 0) {
      setBulkError('No rows found to import.')
      return
    }
    if (bulkCount > 200) {
      setBulkError('Limit is 200 rows per import.')
      return
    }

    setBulkError('')
    setBusyId('bulk')
    const res = await fetch('/api/admin/social/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: bulkContent,
        publishedDefault: bulkPublishedDefault,
      }),
    })
    const payload = await res.json().catch(() => ({}))
    setBusyId(null)
    if (!res.ok) {
      setBulkError(payload.error || 'Bulk import failed.')
      return
    }
    if (Array.isArray(payload.inserted)) {
      setPosts((prev) => [...payload.inserted, ...prev])
    }
    setBulkSummary(payload.summary || null)
    setBulkContent('')
    setBulkPreview([])
    setBulkCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin — Social Manager</h1>
          <p className="text-white/60 text-sm">
            Add manual posts and optionally run API sync when configured.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSync}
          disabled={busyId === 'sync'}
          className="btn inline-flex items-center gap-2"
        >
          <FaSyncAlt aria-hidden="true" />
          Run sync now
        </button>
      </div>

      <form onSubmit={handleCreate} className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm space-y-2">
            <span className="text-white/70">Post URL</span>
            <input
              required
              type="url"
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="https://www.instagram.com/p/..."
            />
          </label>
          <label className="text-sm space-y-2">
            <span className="text-white/70">Platform</span>
            <select
              value={form.platform}
              onChange={(event) => setForm({ ...form, platform: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="auto">Auto-detect</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </label>
          <label className="text-sm space-y-2">
            <span className="text-white/70">Title override</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="Optional title"
            />
          </label>
          <label className="text-sm space-y-2">
            <span className="text-white/70">Post date (optional)</span>
            <input
              type="datetime-local"
              value={form.postDate}
              onChange={(event) => setForm({ ...form, postDate: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs text-white/50">
              Leave blank if unknown; the site will show "Added on" instead.
            </span>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => setForm({ ...form, published: event.target.checked })}
            className="h-4 w-4"
          />
          Publish immediately
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={busyId === 'new'} className="btn">
            Save post
          </button>
          {status ? <span className="text-sm text-white/60">{status}</span> : null}
        </div>
      </form>

      <section className="card space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Bulk import</h2>
            <p className="text-sm text-white/60">
              Upload a CSV or paste URLs to add multiple posts at once.
            </p>
          </div>
          <a href="/templates/social_posts_import.csv" download className="btn">
            Download CSV template
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm space-y-2" htmlFor="bulk-csv">
            <span className="text-white/70">CSV file</span>
            <input
              id="bulk-csv"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleBulkFile}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm space-y-2" htmlFor="bulk-paste">
            <span className="text-white/70">Paste URLs (one per line)</span>
            <textarea
              id="bulk-paste"
              rows={6}
              value={bulkContent}
              onChange={(event) => setBulkContent(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="https://www.instagram.com/p/..."
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={bulkPublishedDefault}
            onChange={(event) => setBulkPublishedDefault(event.target.checked)}
            className="h-4 w-4"
          />
          Publish immediately when published is blank
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/70">
            <span>{bulkCount ? `${bulkCount} rows detected` : 'No rows detected yet.'}</span>
            <span>Previewing first 10 rows.</span>
          </div>
          {bulkPreview.length === 0 ? (
            <div className="text-sm text-white/50">Upload a file or paste content to preview.</div>
          ) : (
            <div className="space-y-2 text-xs">
              {bulkPreview.map((row) => (
                <div
                  key={row.rowIndex}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <div className="text-white/60">Row {row.rowIndex}</div>
                  <div className="text-white/80 truncate">{row.url || 'Missing URL'}</div>
                  <div className="text-white/50">
                    {row.platform || 'auto'} • {row.title || 'Untitled'} •{' '}
                    {row.postDate || 'no date'} • {row.published || 'default'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {bulkError ? <div className="text-sm text-red-300">{bulkError}</div> : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBulkImport}
            disabled={busyId === 'bulk'}
            className="btn"
          >
            {busyId === 'bulk' ? 'Importing…' : 'Import CSV'}
          </button>
          {bulkSummary ? (
            <span className="text-sm text-white/60">
              Imported {bulkSummary.imported} · Skipped {bulkSummary.duplicates} · Failed{' '}
              {bulkSummary.failed.length}
            </span>
          ) : null}
        </div>

        {bulkSummary?.failed.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm space-y-2">
            <div className="text-white/70 font-semibold">Failed rows</div>
            {bulkSummary.failed.map((row) => (
              <div key={`${row.row}-${row.url ?? 'row'}`} className="text-white/60">
                Row {row.row}: {row.reason}
                {row.url ? ` (${row.url})` : ''}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card">No social posts yet.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.image_url ||
                      (post.platform === 'instagram'
                        ? '/images/social/instagram-placeholder.jpg'
                        : '/images/social/linkedin-placeholder.jpg')
                    }
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${platformMeta[post.platform].badge}`}
                    >
                      {platformMeta[post.platform].icon}
                      {platformMeta[post.platform].label}
                    </span>
                    <div className="text-xs text-white/50 mt-2">
                      Source: {post.source} • Created {new Date(post.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={busyId === post.id}
                  className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200"
                >
                  <FaTrash aria-hidden="true" />
                  Delete
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm space-y-2 md:col-span-2">
                  <span className="text-white/70">Title</span>
                  <input
                    type="text"
                    value={post.title ?? ''}
                    onChange={(event) =>
                      setPosts((prev) =>
                        prev.map((row) =>
                          row.id === post.id ? { ...row, title: event.target.value } : row
                        )
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
                <label className="text-sm space-y-2">
                  <span className="text-white/70">Post date (optional)</span>
                  <input
                    type="datetime-local"
                    value={toInputDate(post.post_date)}
                    onChange={(event) =>
                      setPosts((prev) =>
                        prev.map((row) =>
                          row.id === post.id ? { ...row, post_date: event.target.value } : row
                        )
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={post.published}
                  onChange={(event) =>
                    setPosts((prev) =>
                      prev.map((row) =>
                        row.id === post.id ? { ...row, published: event.target.checked } : row
                      )
                    )
                  }
                  className="h-4 w-4"
                />
                Published
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate(post)}
                  disabled={busyId === post.id}
                  className="btn"
                >
                  Save changes
                </button>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white"
                >
                  View post
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
