'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Row = {
  id: string
  user_id: string
  caption: string | null
  note: string | null
  media: { type: 'photo'|'video'; path: string }[]
  status: 'submitted'|'approved'|'rejected'|'needs_more'
  created_at: string
}

export default function ReviewClient({ initialRows }: { initialRows: Row[] }) {
  const supabase = createClientComponentClient()
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [signed, setSigned] = useState<Record<string, string>>({}) // path -> url
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    // sign previews
    (async () => {
      const entries: [string, string][] = []
      for (const r of rows) {
        for (const m of r.media) {
          const { data, error } = await supabase
            .storage.from('plant-media')
            .createSignedUrl(m.path, 60 * 60) // 1h
          if (!error && data?.signedUrl) entries.push([m.path, data.signedUrl])
        }
      }
      const obj: Record<string,string> = {}
      entries.forEach(([k,v]) => obj[k] = v)
      setSigned(obj)
    })()
  }, [rows, supabase])

  const act = async (id: string, status: Row['status'], admin_note?: string) => {
    setBusy(id)
    const { error } = await supabase
      .from('plantings')
      .update({ status, admin_note, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    setBusy(null)
    if (!error) setRows(r => r.filter(x => x.id !== id))
    // TODO: On approve, award badge + create certificate record (server route).
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Admin — Review Submissions</h1>
      <p className="text-white/60 mb-6">Approve genuine plantings. Reject spam/fakes. Ask for more proof if needed.</p>

      {rows.length === 0 && <div className="card">No pending submissions.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-sm text-white/50">{new Date(r.created_at).toLocaleString()}</div>
            <div className="font-semibold mt-1">{r.caption || 'No caption'}</div>
            {r.note && <div className="text-white/70 mt-1 text-sm">{r.note}</div>}

            <div className="mt-3 grid grid-cols-2 gap-2">
              {r.media.map((m, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-black/20 aspect-video">
                  {m.type === 'video' ? (
                    <video controls src={signed[m.path]} className="w-full h-full object-cover" />
                  ) : (
                    <img src={signed[m.path]} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={busy === r.id} onClick={() => act(r.id,'approved')}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500">Approve</button>
              <button disabled={busy === r.id} onClick={() => act(r.id,'needs_more','Please add a short video or more photos.')}
                className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500">Needs more</button>
              <button disabled={busy === r.id} onClick={() => act(r.id,'rejected','Looks unrelated / reused image.')}
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}