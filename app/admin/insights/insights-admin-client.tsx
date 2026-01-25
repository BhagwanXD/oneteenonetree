'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Icon from '@/components/Icon'

type InsightRow = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  published_at: string | null
  updated_at: string | null
  created_at: string
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function InsightsAdminClient({
  initialInsights,
}: {
  initialInsights: InsightRow[]
}) {
  const supabase = createClientComponentClient()
  const [insights, setInsights] = useState(initialInsights)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return insights.filter((item) => {
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [insights, query, statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this insight? This cannot be undone.')) return
    setDeletingId(id)
    const { error } = await supabase.from('insights').delete().eq('id', id)
    if (!error) {
      setInsights((prev) => prev.filter((item) => item.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin — Insights</h1>
          <p className="text-sm text-white/60">
            Create, publish, and manage insights for the public site.
          </p>
        </div>
        <Link href="/admin/insights/new" className="btn">
          Create new insight
        </Link>
      </header>

      <div className="grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
        <div className="relative">
          <Icon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or slug..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as any)}
          className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-white/5 text-white/70 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-white/60" colSpan={6}>
                  No insights found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-t border-white/10 text-sm">
                  <td className="px-4 py-3 font-medium text-white">{item.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${
                        item.status === 'published'
                          ? 'border-emerald-400/40 text-emerald-200'
                          : 'border-white/10 text-white/60'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70">{formatDate(item.updated_at)}</td>
                  <td className="px-4 py-3 text-white/70">
                    {formatDate(item.published_at)}
                  </td>
                  <td className="px-4 py-3 text-white/60">{item.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/insights/${item.id}/edit`}
                        className="text-white/70 hover:text-white transition"
                      >
                        Edit
                      </Link>
                      {item.status === 'published' ? (
                        <Link
                          href={`/insights/${item.slug}`}
                          className="text-white/70 hover:text-white transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-red-200/70 hover:text-red-200 transition"
                      >
                        {deletingId === item.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
