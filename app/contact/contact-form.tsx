'use client'

import { useState } from 'react'

const subjectOptions = [
  'General query',
  'Partnership / CSR',
  'Media / Press',
  'Volunteering',
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: subjectOptions[0],
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )

  const validate = () => {
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()
    if (!name || !email || !message) {
      return 'Please fill in all required fields.'
    }
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.'
    }
    if (!subjectOptions.includes(form.subject)) {
      return 'Please choose a subject.'
    }
    if (name.length > 120 || email.length > 200 || message.length > 2000) {
      return 'Please shorten your response.'
    }
    if (form.phone.trim().length > 40) {
      return 'Please shorten your phone number.'
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFeedback(null)

    const validationError = validate()
    if (validationError) {
      setFeedback({ type: 'error', message: validationError })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject,
          message: form.message,
        }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFeedback({
          type: 'error',
          message: payload?.error || 'Unable to send your message right now.',
        })
        return
      }

      setFeedback({
        type: 'success',
        message: "Thanks for reaching out. We'll get back to you soon.",
      })
      setForm(initialForm)
    } catch {
      setFeedback({ type: 'error', message: 'Unable to send your message right now.' })
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (feedback?.type === 'error') {
      setFeedback(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={submitting}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm space-y-2" htmlFor="contact-name">
          <span className="text-white/70">Full name</span>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="Your full name"
          />
        </label>
        <label className="text-sm space-y-2" htmlFor="contact-email">
          <span className="text-white/70">Email address</span>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm space-y-2" htmlFor="contact-phone">
          <span className="text-white/70">Phone / WhatsApp (optional)</span>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="+91 98765 43210"
          />
        </label>
        <label className="text-sm space-y-2" htmlFor="contact-subject">
          <span className="text-white/70">Subject</span>
          <select
            id="contact-subject"
            name="subject"
            required
            value={form.subject}
            onChange={(event) => updateField('subject', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          >
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="text-sm space-y-2" htmlFor="contact-message">
        <span className="text-white/70">Message</span>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          placeholder="Tell us how we can help..."
        />
      </label>

      {feedback ? (
        <div
          className={feedback.type === 'success' ? 'text-emerald-300 text-sm' : 'text-red-300 text-sm'}
          role={feedback.type === 'success' ? 'status' : 'alert'}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="space-y-3">
        <button type="submit" disabled={submitting} className="btn">
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        <p className="text-xs text-white/60">
          Your details are safe and will only be used to respond to your query.
        </p>
      </div>
    </form>
  )
}
