'use client'

import { useMemo, useState } from 'react'

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
  const bits = [item.city, item.year, item.drive_type].filter(Boolean).join(' ')
  return bits ? `${bits} photo` : 'OneTeenOneTree gallery photo'
}

const formatMeta = (item: GalleryItem) => {
  const parts = [item.city, item.year ? `${item.year}` : null, item.drive_type].filter(Boolean)
  return parts.join(' • ')
}

export default function GalleryClient({
  initialItems,
  showAdminCta,
}: {
  initialItems: GalleryItem[]
  showAdminCta?: boolean
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleItems = useMemo(
    () => initialItems.slice(0, visibleCount),
    [initialItems, visibleCount]
  )

  return (
    <section className="py-10">
      <div className="container space-y-6">
        {initialItems.length === 0 ? (
          <div className="space-y-6">
            <div className="card text-center space-y-3">
              <h2 className="text-xl font-semibold">No photos yet.</h2>
              <p className="text-white/70">
                We&apos;ll add drive photos soon. Check back for updates.
              </p>
              {showAdminCta ? (
                <a href="/admin/gallery" className="btn justify-center">
                  Upload photos
                </a>
              ) : null}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="card p-0 overflow-hidden">
                  <div className="aspect-[4/3] bg-white/5 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-2/3 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item) => {
                const meta = formatMeta(item)
                return (
                  <div
                    key={item.id}
                    className="card p-0 overflow-hidden transition hover:-translate-y-1 hover:border-white/20"
                  >
                    {item.image_url ? (
                      <a
                        href={item.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-black/20"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={getAltText(item)}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-[4/3] flex items-center justify-center text-sm text-white/60 bg-black/20">
                        Photo coming soon
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h3 className="text-base font-semibold">
                        {item.caption || 'OneTeenOneTree drive'}
                      </h3>
                      {meta ? <div className="text-xs text-white/60">{meta}</div> : null}
                    </div>
                  </div>
                )
              })}
            </div>

            {initialItems.length > visibleCount ? (
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
          </>
        )}
      </div>
    </section>
  )
}
