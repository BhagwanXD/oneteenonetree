'use client'

import { useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SeoMapRow = {
  category: string
  pillar_slug: string
  cluster_slugs: string[] | null
  action_type: string
  anchor_variants: any | null
}

type RowState = SeoMapRow & {
  originalCategory: string
  clusterInput: string
  anchorInput: string
  saving?: boolean
}

const normalizeList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export default function SeoMapClient({ initialRows }: { initialRows: SeoMapRow[] }) {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [rows, setRows] = useState<RowState[]>(
    initialRows.map((row) => ({
      ...row,
      originalCategory: row.category,
      clusterInput: (row.cluster_slugs ?? []).join(', '),
      anchorInput: row.anchor_variants ? JSON.stringify(row.anchor_variants, null, 2) : '',
    }))
  )
  const [notice, setNotice] = useState('')

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        category: '',
        pillar_slug: '',
        cluster_slugs: [],
        action_type: '/pledge',
        anchor_variants: null,
        originalCategory: '',
        clusterInput: '',
        anchorInput: '',
      },
    ])
  }

  const updateRow = (index: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)))
  }

  const saveRow = async (index: number) => {
    const row = rows[index]
    if (!row.category.trim() || !row.pillar_slug.trim()) {
      setNotice('Category and pillar slug are required.')
      return
    }

    let anchorPayload: any = null
    if (row.anchorInput.trim()) {
      try {
        anchorPayload = JSON.parse(row.anchorInput)
      } catch {
        setNotice('Anchor variants must be valid JSON.')
        return
      }
    }

    setNotice('')
    updateRow(index, { saving: true })

    const payload = {
      category: row.category.trim(),
      pillar_slug: row.pillar_slug.trim(),
      cluster_slugs: normalizeList(row.clusterInput),
      action_type: row.action_type.trim() || '/pledge',
      anchor_variants: anchorPayload,
    }

    if (row.originalCategory && row.originalCategory !== payload.category) {
      await supabase.from('insight_links_map').delete().eq('category', row.originalCategory)
    }

    const { error } = await supabase.from('insight_links_map').upsert(payload, {
      onConflict: 'category',
    })

    if (error) {
      setNotice(error.message)
    } else {
      updateRow(index, {
        ...payload,
        originalCategory: payload.category,
        clusterInput: payload.cluster_slugs.join(', '),
        anchorInput: anchorPayload ? JSON.stringify(anchorPayload, null, 2) : '',
        saving: false,
      })
      setNotice('SEO map saved.')
    }

    updateRow(index, { saving: false })
  }

  const deleteRow = async (index: number) => {
    const row = rows[index]
    if (!row.originalCategory) {
      setRows((prev) => prev.filter((_, idx) => idx !== index))
      return
    }
    const { error } = await supabase.from('insight_links_map').delete().eq('category', row.originalCategory)
    if (error) {
      setNotice(error.message)
      return
    }
    setRows((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className="container py-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Insights SEO map</h1>
          <p className="text-sm text-white/60">
            Map each category to pillar, cluster, and action links for automatic internal linking.
          </p>
        </div>
        <button className="btn" onClick={addRow}>
          Add category map
        </button>
      </header>

      {notice ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {notice}
        </div>
      ) : null}

      <div className="space-y-6">
        {rows.map((row, index) => (
          <div key={`${row.originalCategory}-${index}`} className="card space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Category</label>
                <input
                  value={row.category}
                  onChange={(event) => updateRow(index, { category: event.target.value })}
                  placeholder="corporate-sustainability"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Pillar slug</label>
                <input
                  value={row.pillar_slug}
                  onChange={(event) => updateRow(index, { pillar_slug: event.target.value })}
                  placeholder="pillar-slug"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-white/70">Cluster slugs (comma separated)</label>
                <input
                  value={row.clusterInput}
                  onChange={(event) => updateRow(index, { clusterInput: event.target.value })}
                  placeholder="cluster-one, cluster-two"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Action path</label>
                <input
                  value={row.action_type}
                  onChange={(event) => updateRow(index, { action_type: event.target.value })}
                  placeholder="/pledge"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-white/70">Anchor variants (JSON)</label>
                <textarea
                  value={row.anchorInput}
                  onChange={(event) => updateRow(index, { anchorInput: event.target.value })}
                  rows={4}
                  placeholder='{"pillar":"Read the guide","clusters":["More tips"],"action":"Join the pledge"}'
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-mono focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn"
                onClick={() => saveRow(index)}
                disabled={row.saving}
              >
                {row.saving ? 'Saving...' : 'Save map'}
              </button>
              <button
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
                onClick={() => deleteRow(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
