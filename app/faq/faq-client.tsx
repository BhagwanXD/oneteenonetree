'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaLink } from 'react-icons/fa'
import { faqSections, type FaqAnswerPart, type FaqSection } from './faq-data'

const normalize = (value: string) => value.toLowerCase()

const renderAnswerPart = (part: FaqAnswerPart, index: number) => {
  if (typeof part === 'string') {
    return <span key={`${index}-text`}>{part}</span>
  }
  return (
    <Link
      key={`${index}-link`}
      href={part.href}
      className="text-white/80 hover:text-white underline underline-offset-4"
    >
      {part.label}
    </Link>
  )
}

export default function FaqClient() {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredSections = useMemo(() => {
    if (!query.trim()) return faqSections
    const q = normalize(query.trim())
    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const combined = `${item.question} ${item.answerText}`
          return normalize(combined).includes(q)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [query])

  const totalMatches = filteredSections.reduce((sum, section) => sum + section.items.length, 0)

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setOpenId(hash)
        const el = document.getElementById(hash)
        if (el) {
          window.setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 60)
        }
      }
    }
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)
    return () => window.removeEventListener('hashchange', updateFromHash)
  }, [])

  useEffect(() => {
    if (!openId) return
    const stillVisible = filteredSections.some((section) =>
      section.items.some((item) => item.id === openId)
    )
    if (!stillVisible) setOpenId(null)
  }, [filteredSections, openId])

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${id}`)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setCopiedId(null)
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold">Frequently Asked Questions</h1>
        <p className="text-white/70 text-lg max-w-3xl">
          Answers about OneTeenOneTree, the pledge, planting drives, verification, donations, and
          partnerships.
        </p>
        <div className="card max-w-3xl space-y-3">
          <label className="text-sm text-white/70" htmlFor="faq-search">
            Search questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for pledges, verification, donations..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          />
          <div className="text-xs text-white/50">
            {query.trim()
              ? `${totalMatches} question${totalMatches === 1 ? '' : 's'} found`
              : 'Search across all FAQs.'}
          </div>
        </div>
      </section>

      {totalMatches === 0 ? (
        <div className="card text-center text-white/70">
          No matching questions. Try a different term.
        </div>
      ) : (
        filteredSections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => {
                const isOpen = openId === item.id
                const panelId = `faq-panel-${item.id}`
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] scroll-mt-28"
                  >
                    <div className="flex items-start gap-3 px-5 py-4">
                      <button
                        type="button"
                        className="flex-1 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                      >
                        <span className="font-medium">{item.question}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id)}
                        className="text-xs text-white/60 hover:text-white transition flex items-center gap-1"
                        aria-label={`Copy link to ${item.question}`}
                      >
                        <FaLink aria-hidden="true" />
                        {copiedId === item.id ? 'Copied' : 'Copy link'}
                      </button>
                      <span className="text-white/60 text-lg">{isOpen ? '−' : '+'}</span>
                    </div>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={item.id}
                      className={`px-5 pb-4 text-sm text-white/70 space-y-3 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      <div>{item.answer.map(renderAnswerPart)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))
      )}

      <section className="card space-y-4">
        <h2 className="text-2xl font-bold">Related links</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/pledge" className="btn">
            Take the pledge
          </Link>
          <Link href="/donate" className="btn">
            Donate
          </Link>
          <Link href="/contact" className="btn">
            Partner with us
          </Link>
        </div>
      </section>
    </div>
  )
}
