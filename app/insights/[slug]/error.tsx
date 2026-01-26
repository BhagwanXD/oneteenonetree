'use client'

import Link from 'next/link'

export default function InsightError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container py-12">
      <div className="card max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Something went wrong</h1>
        <p className="text-white/70">
          We couldn&apos;t load this insight right now. Please try again.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn">
            Retry
          </button>
          <Link href="/insights" className="btn">
            Back to insights
          </Link>
        </div>
        <p className="text-xs text-white/40">{error.message}</p>
      </div>
    </div>
  )
}
