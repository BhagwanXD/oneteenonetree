'use client'

import { useMemo, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type MediaItem = { type: 'photo' | 'video'; file: File }

export default function PlantForm() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [caption, setCaption] = useState('')
  const [note, setNote] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const videos = useMemo(() => media.filter(m => m.type === 'video'), [media])
  const photos = useMemo(() => media.filter(m => m.type === 'photo'), [media])

  const onFiles = (files: FileList | null) => {
    if (!files) return
    const next: MediaItem[] = []
    Array.from(files).forEach((f) => {
      const isVideo = f.type.startsWith('video/')
      const isImage = f.type.startsWith('image/')
      if (isVideo) next.push({ type: 'video', file: f })
      else if (isImage) next.push({ type: 'photo', file: f })
    })
    setMedia((m) => [...m, ...next])
  }

  const removeAt = (idx: number) => setMedia((m) => m.filter((_, i) => i !== idx))

  // REQUIRE: ≥1 video AND ≥3 photos
  const validate = () => {
    if (videos.length < 1 || photos.length < 3) {
      return 'Please upload at least 1 video AND 3 photos.'
    }
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    const v = validate()
    if (v) { setErr(v); return }
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErr('Not signed in'); setSubmitting(false); return }

    // Build multipart form-data for your API route
    const fd = new FormData()
    fd.append('caption', caption)
    fd.append('note', note)
    media.forEach((m) => fd.append('files', m.file, m.file.name))

    const res = await fetch('/api/plant/submit', {
      method: 'POST',
      body: fd,
    })

    if (!res.ok) {
      const t = await res.text()
      setErr(t || 'Failed to submit')
      setSubmitting(false)
      return
    }

    router.push('/pledge/success')
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Requirement status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ReqPill label="Videos" count={videos.length} need="≥1" ok={videos.length >= 1} />
        <ReqPill label="Photos" count={photos.length} need="≥3" ok={photos.length >= 3} />
        <ReqPill label="Total files" count={media.length} need="any" ok={media.length > 0} />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Short caption (optional)</label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="e.g., Planted a neem sapling near our school gate."
        />
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFiles(e.dataTransfer.files)
        }}
        className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 md:p-8 text-center hover:border-white/25 transition"
      >
        <div className="text-4xl mb-2">📤</div>
        <p className="text-white/80 font-medium">Drag & drop media here</p>
        <p className="text-white/50 text-sm">Or</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 inline-flex items-center rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 transition"
        >
          Choose files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />
        <p className="text-white/50 text-xs mt-3">
          Tip: Landscape photos and a short video (&lt;100MB) work best.
        </p>
      </div>

      {/* Previews */}
      {media.length > 0 && (
        <ul className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {media.map((m, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>{m.type === 'video' ? '🎥 Video' : '🖼️ Photo'}</span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-red-300 hover:text-red-200"
                  aria-label="Remove file"
                >
                  Remove
                </button>
              </div>
              <div className="truncate text-xs text-white/60 mt-1">{m.file.name}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm text-white/70 mb-1">Questions / comments (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Anything we should know? Species, exact spot, help needed, etc."
        />
      </div>

      {/* Error + Submit */}
      {err && <div className="text-red-400 text-sm">{err}</div>}

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-center">
        <button
          disabled={submitting}
          className="rounded-xl px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
        <a href="/dashboard" className="text-white/70 hover:text-white text-sm">
          Edit profile details →
        </a>
      </div>
    </form>
  )
}

function ReqPill({ label, count, need, ok }: { label: string; count: number; need: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-white/60 text-xs">{label}</div>
        <div className="text-white font-semibold">{count}</div>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-lg ${
          ok ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-700/40'
             : 'bg-yellow-600/20 text-yellow-300 border border-yellow-700/40'
        }`}
      >
        need {need}
      </span>
    </div>
  )
}