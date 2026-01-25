'use client'

import data from '@/data/leaderboard.json'
import { useState, useMemo } from 'react'
import Reveal from '@/components/Reveal'

export default function LeaderboardClient() {
  const [sortMode, setSortMode] = useState<'high' | 'low'>('high')
  const [filter, setFilter] = useState<'all' | 'school' | 'city'>('all')
  const entries = [...data]

  const filtered = useMemo(() => {
    let list = [...entries]
    if (filter === 'school') {
      list = list.filter((e) => e.school === 'KiiT International School')
    } else if (filter === 'city') {
      list = list.filter((e) => e.city === 'Bhubaneswar')
    }
    return list.sort((a, b) => (sortMode === 'high' ? b.trees - a.trees : a.trees - b.trees))
  }, [sortMode, filter, entries])

  return (
    <Reveal>
      <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Sort:</label>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as any)}
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
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-1 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="school">School: KiiT Intl</option>
            <option value="city">City: Bhubaneswar</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
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
            {filtered.map((entry, index) => (
              <tr key={`${entry.name}-${index}`} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/70">#{index + 1}</td>
                <td className="py-3 pr-4 font-medium text-white">{entry.name}</td>
                <td className="py-3 pr-4 text-white/70">{entry.school}</td>
                <td className="py-3 pr-4 text-white/70">{entry.city}</td>
                <td className="py-3 pr-4 text-white font-semibold">{entry.trees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
    </Reveal>
  )
}
