'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// ✅ dynamic import (no SSR)
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function SuccessClient({
  firstName,
  totalPledges,
  totalTrees,
}: {
  firstName: string | null
  totalPledges: number
  totalTrees: number
}) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.oneteenonetree.org/'
  const shareText = `I just pledged a tree with OneTeenOneTree 🌱 Join me: ${origin}`

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      alert('Caption copied! Paste it in Instagram/WhatsApp.')
    } catch {}
  }

  return (
    <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center">
      {size.w > 0 && (
        <Confetti
          width={size.w}
          height={size.h}
          recycle={false}
          numberOfPieces={400}
          gravity={0.35}
          wind={0}
          confettiSource={{ x: 0, y: 0, w: size.w, h: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}

      <div className="container max-w-3xl text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          🌳 Thank You {firstName ? `${firstName}!` : 'Friend!'}
        </h1>
        <p className="text-white/80 mt-4 text-lg">
          Your pledge has been recorded. You’ve taken a small step that grows into a lasting impact.
        </p>

        {/* replaced boxes with clean text summary */}
        <p className="mt-3 text-white/60 text-sm">
          So far, <b>{totalPledges.toLocaleString()}</b> pledges have been taken{' '}
          <b>, next up plant {totalTrees.toLocaleString()}</b> trees to create impact 🌍
        </p>

        {/* action buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={copyCaption}
            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 transition"
          >
            📸 Copy Instagram Caption
          </button>
          <a
            href="https://www.instagram.com/oneteen.onetree/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-700/80 hover:bg-pink-600 text-white px-4 py-2 transition"
          >
            🔗 Open Instagram
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(origin)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 transition"
          >
            💼 Share on LinkedIn
          </a>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 hover:bg-white/5 px-4 py-2"
          >
            🏆 View Leaderboard
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/pledge"
            className="inline-flex gap-2 rounded-xl border border-white/15 hover:bg-white/5 px-4 py-2"
          >
            ➕ Make another pledge
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex gap-2 rounded-xl border border-white/15 hover:bg-white/5 px-4 py-2"
          >
            👤 Go to Dashboard
          </Link>
        </div>

        <p className="text-white/60 mt-10 text-sm">
          Keep nurturing your tree — and inspire others to plant theirs.
        </p>
      </div>
    </section>
  )
}
