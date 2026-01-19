'use client'

import data from '@/data/leaderboard.json'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Leaderboard() {
  const [sortMode, setSortMode] = useState<'high' | 'low'>('high')
  const [filter, setFilter] = useState<'all' | 'school' | 'city'>('all')
  const [mounted, setMounted] = useState(false)

  // Mount detection for smooth entry animation
  useEffect(() => {
    // Mount immediately; avoid artificial delay
    setMounted(true)
  }, [])

  // All entries
  const entries = [...data]

  const filtered = useMemo(() => {
    let list = [...entries]
    if (filter === 'school') {
      list = list.filter(e => e.school === 'KiiT International School')
    } else if (filter === 'city') {
      list = list.filter(e => e.city === 'Bhubaneswar')
    }
    return list.sort((a, b) => sortMode === 'high' ? b.trees - a.trees : a.trees - b.trees)
  }, [sortMode, filter, entries])

  return (
    <motion.section
      className="py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-3xl font-bold">Leaderboard</h2>
      <p className="text-white/70 mt-2">
        Youth and students ranked by trees planted — filter and explore.
      </p>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Sort:</label>
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as any)}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-1 text-sm text-white"
          >
            <option value="high">🌿 High → Low</option>
            <option value="low">🌱 Low → High</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Filter:</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-1 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="school">School: KiiT Intl</option>
            <option value="city">City: Bhubaneswar</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-white/60 border-b border-white/10">
              <th className="py-2 pr-4">Rank</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">School</th>
              <th className="py-2 pr-4">City</th>
              <th className="py-2 pr-4">Trees</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {mounted &&
                filtered.map((r, i) => (
                  <motion.tr
                    key={r.name + filter + sortMode}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 pr-4 text-white/70">{i + 1}</td>
                    <td className="py-3 pr-4 font-semibold">{r.name}</td>
                    <td className="py-3 pr-4">{r.school}</td>
                    <td className="py-3 pr-4">{r.city}</td>
                    <td className="py-3 pr-4 font-bold text-[var(--acc)]">
                      {r.trees}
                    </td>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <motion.div
        className="mt-8 text-center text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Showing {filtered.length} participants — Total trees:{' '}
        <span className="text-[var(--acc)] font-semibold">
          {filtered.reduce((a, b) => a + b.trees, 0)}
        </span>
      </motion.div>
    </motion.section>
  )
}
