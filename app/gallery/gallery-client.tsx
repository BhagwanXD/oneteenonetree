'use client'

import { useEffect, useMemo, useState } from 'react'

type GalleryItem = {
  id: string
  image_url: string
  caption: string | null
  city: string | null
  year: number | null
  drive_type: string | null
  tags: string[] | null
  sort_order: number | null
  taken_at: string | null
  created_at: string
}

const PAGE_SIZE = 12

const getAltText = (item: GalleryItem) => {
  if (item.caption) return item.caption
  const drive = item.drive_type || 'Drive'
  const city = item.city || 'India'
  const year = item.year ? `${item.year}` : 'OneTeenOneTree'
  return `${drive} in ${city} (${year})`
}

export default function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [filters, setFilters] = useState({
    city: 'all',
    year: 'all',
    driveType: 'all',
    query: '',
  })
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const cities = useMemo(() => {
    const values = Array.from(
      new Set(initialItems.map((item) => item.city).filter(Boolean) as string[])
    )
    return values.sort((a, b) => a.localeCompare(b))
  }, [initialItems])

  const years = useMemo(() => {
    const values = Array.from(
      new Set(initialItems.map((item) => item.year).filter(Boolean) as number[])
    )
    return values.sort((a, b) => b - a)
  }, [initialItems])

  const driveTypes = useMemo(() => {
    const values = Array.from(
      new Set(initialItems.map((item) => item.drive_type).filter(Boolean) as string[])
    )
    return values.sort((a, b) => a.localeCompare(b))
  }, [initialItems])

  const filteredItems = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return initialItems.filter((item) => {
      if (filters.city !== 'all' && item.city !== filters.city) return false
      if (filters.year !== 'all' && `${item.year ?? ''}` !== filters.year) return false
      if (filters.driveType !== 'all' && item.drive_type !== filters.driveType) return false
      if (!query) return true
      const haystack = [
        item.caption ?? '',
        item.city ?? '',
        item.drive_type ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [filters, initialItems])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters.city, filters.driveType, filters.query, filters.year])

  const visibleItems = filteredItems.slice(0, visibleCount)

  const resetFilters = () => {
    setFilters({ city: 'all', year: 'all', driveType: 'all', query: '' })
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="py-10">
      <div className="container space-y-6">
        <div className="card space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-white/70" htmlFor="gallery-search">
                Search by caption or city
              </label>
              <input
                id="gallery-search"
                type="search"
                value={filters.query}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, query: event.target.value }))
                }
                placeholder="Search drive, city, or caption"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70" htmlFor="gallery-city">
                City
              </label>
              <select
                id="gallery-city"
                value={filters.city}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, city: event.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              >
                <option value="all">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70" htmlFor="gallery-year">
                Year
              </label>
              <select
                id="gallery-year"
                value={filters.year}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, year: event.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              >
                <option value="all">All years</option>
                {years.map((year) => (
                  <option key={year} value={`${year}`}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-white/70" htmlFor="gallery-drive">
                Drive type
              </label>
              <select
                id="gallery-drive"
                value={filters.driveType}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, driveType: event.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              >
                <option value="all">All drive types</option>
                {driveTypes.map((drive) => (
                  <option key={drive} value={drive}>
                    {drive}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="button" onClick={resetFilters} className="btn w-full justify-center">
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="card text-center text-white/70">No photos match these filters yet.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <div key={item.id} className="card p-0 overflow-hidden">
                {item.image_url ? (
                  <a
                    href={item.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/20"
                  >
                    <img
                      src={item.image_url}
                      alt={getAltText(item)}
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="h-52 flex items-center justify-center text-sm text-white/60 bg-black/20">
                    Photo coming soon
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.caption || 'Plantation drive photo'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/70">
                    {item.city ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        {item.city}
                      </span>
                    ) : null}
                    {item.year ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        {item.year}
                      </span>
                    ) : null}
                    {item.drive_type ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        {item.drive_type}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length > visibleCount ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="btn"
            >
              Load more
            </button>
          </div>
        ) : null}

        <div className="card text-sm text-white/70">
          OneTeenOneTree gallery highlights student-led tree plantation drives across cities, with
          verified impact and community partners making climate action visible.
        </div>
      </div>
    </section>
  )
}
