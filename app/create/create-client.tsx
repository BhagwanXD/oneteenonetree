'use client'

import { useEffect, useRef, useState } from 'react'
import Controls from './components/Controls'
import PosterCanvas from './components/PosterCanvas'
import { SIZE_OPTIONS, LOCKED_COPY } from './constants'
import type { PosterState } from './types'
import { slugify } from '@/lib/gallery'
import Icon from '@/components/Icon'

const defaultState: PosterState = {
  size: 'square',
  name: '',
}

const getSizeLabel = (value: PosterState['size']) =>
  SIZE_OPTIONS.find((option) => option.value === value)?.label ?? 'Square 1080 x 1080'

const getExportSize = (value: PosterState['size']) =>
  SIZE_OPTIONS.find((option) => option.value === value) ?? SIZE_OPTIONS[0]

export default function CreateClient() {
  const [state, setState] = useState<PosterState>(defaultState)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl)
      }
    }
  }, [photoUrl])

  const updateState = (patch: Partial<PosterState>) => {
    setState((prev) => ({ ...prev, ...patch }))
    if (notice) setNotice('')
  }

  const handlePhotoChange = (file: File | null) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(file ? URL.createObjectURL(file) : null)
  }

  const missingName = !state.name.trim()
  const missingPhoto = !photoUrl
  const canExport = !(missingName || missingPhoto)
  const effectiveTitle = LOCKED_COPY.title

  const handleDownload = () => {
    if (!canExport) {
      setNotice('Add your name and a photo to export.')
      return
    }
    if (!effectiveTitle.trim()) {
      setNotice('Add a title before exporting.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const { width, height } = getExportSize(state.size)
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = width
    exportCanvas.height = height
    const exportCtx = exportCanvas.getContext('2d')
    if (!exportCtx) return
    exportCtx.imageSmoothingEnabled = true
    exportCtx.imageSmoothingQuality = 'high'
    exportCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height)
    const titleSlug = slugify(effectiveTitle)
    const fileName = `oneteenonetree-one-tree-${titleSlug || 'poster'}.png`
    const dataUrl = exportCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 hero">
        <div className="container text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Create your OneTeenOneTree poster
          </h1>
          <p className="text-white/70 text-lg">
            Generate a share-ready pledge poster in seconds.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_1.1fr]">
          <Controls
            state={state}
            onChange={updateState}
            onPhotoChange={handlePhotoChange}
            onDownload={handleDownload}
            notice={notice}
            hasPhoto={Boolean(photoUrl)}
            canExport={canExport}
            missingName={missingName}
            missingPhoto={missingPhoto}
          />

          <div className="space-y-6">
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold inline-flex items-center gap-2">
                  <Icon name="camera" size={18} aria-hidden="true" />
                  Live preview
                </h2>
                <div className="text-xs text-white/60">Size: {getSizeLabel(state.size)}</div>
              </div>
              <PosterCanvas state={state} photoUrl={photoUrl} canvasRef={canvasRef} />
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Size: {getSizeLabel(state.size)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-2 text-sm text-white/60">
              <p className="font-semibold text-white">Design tips</p>
              <p>
                Use a clear portrait and keep your name readable. The poster keeps safe margins for
                stories, posts, and web.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
