'use client'

import { useState } from 'react'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

const statusMeta: Record<ContactMessage['status'], { label: string; badge: string }> = {
  new: {
    label: 'New',
    badge: 'border-amber-500/40 bg-amber-600/20 text-amber-200',
  },
  read: {
    label: 'Read',
    badge: 'border-sky-500/40 bg-sky-600/20 text-sky-200',
  },
  replied: {
    label: 'Replied',
    badge: 'border-emerald-500/40 bg-emerald-600/20 text-emerald-200',
  },
}

const previewMessage = (message: string) => {
  const trimmed = message.trim()
  if (trimmed.length <= 140) return trimmed
  return `${trimmed.slice(0, 140)}…`
}

export default function ContactAdminClient({
  initialMessages,
}: {
  initialMessages: ContactMessage[]
}) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string>('')

  const updateStatus = async (id: string, status: ContactMessage['status']) => {
    setNotice('')
    setBusyId(id)
    const res = await fetch('/api/admin/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    const payload = await res.json().catch(() => ({}))
    setBusyId(null)
    if (!res.ok) {
      setNotice(payload.error || 'Failed to update status.')
      return
    }
    setMessages((prev) => prev.map((row) => (row.id === id ? payload.message : row)))
    setNotice('Status updated.')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) {
      return
    }
    setNotice('')
    setBusyId(id)
    const res = await fetch('/api/admin/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const payload = await res.json().catch(() => ({}))
    setBusyId(null)
    if (!res.ok) {
      setNotice(payload.error || 'Failed to delete message.')
      return
    }
    setMessages((prev) => prev.filter((row) => row.id !== id))
    setNotice('Message deleted.')
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>
        <p className="text-white/60">Messages received from the website contact form.</p>
      </div>

      {notice ? (
        <div className="text-sm text-white/70" role="status">
          {notice}
        </div>
      ) : null}

      {messages.length === 0 ? (
        <div className="card">No contact messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const meta = statusMeta[message.status]
            const expanded = expandedId === message.id
            return (
              <div key={message.id} className="card space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">{message.name}</h2>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-sm text-white/70">
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                      >
                        {message.email}
                      </a>
                      <span className="text-white/50"> • </span>
                      <span>{message.subject}</span>
                    </div>
                    <p className="text-sm text-white/60">{previewMessage(message.message)}</p>
                  </div>
                  <div className="text-xs text-white/50">
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(message.id, 'read')}
                    disabled={busyId === message.id || message.status === 'read'}
                    className="px-3 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-sm text-white disabled:opacity-60"
                  >
                    Mark as Read
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(message.id, 'replied')}
                    disabled={busyId === message.id || message.status === 'replied'}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white disabled:opacity-60"
                  >
                    Mark as Replied
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : message.id)}
                    className="px-3 py-2 rounded-lg bg-white/10 text-sm text-white/80 hover:text-white hover:bg-white/20"
                    aria-expanded={expanded}
                  >
                    {expanded ? 'Hide details' : 'View details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(message.id)}
                    disabled={busyId === message.id}
                    className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-sm text-white disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>

                {expanded ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50">Message</div>
                      <p className="text-white/80 mt-2 whitespace-pre-line">{message.message}</p>
                    </div>
                    {message.phone ? (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/50">Phone</div>
                        <div className="text-white/80 mt-1">{message.phone}</div>
                      </div>
                    ) : null}
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50">Received</div>
                      <div className="text-white/70 mt-1">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
