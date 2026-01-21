'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useProfile } from '@/components/ProfileProvider'
import Controls from './components/Controls'
import PosterCanvas from './components/PosterCanvas'
import { BACKGROUND_OPTIONS, SIZE_OPTIONS, TEMPLATE_OPTIONS } from './constants'
import type { PosterState } from './types'
import { slugify } from '@/lib/gallery'
import Icon from '@/components/Icon'

const defaultState: PosterState = {
  template: 'impact',
  size: 'square',
  background: 'gradient',
  title: 'Planting drive highlights',
  subtitle: 'Student-led climate action',
  description: 'Verified trees planted with local schools and volunteers across the city.',
  ctaText: 'Join the pledge',
  ctaLink: 'https://oneteenonetree.org/pledge',
  city: '',
  date: '',
  pledgeName: '',
  pledgeChecked: true,
}

const getSizeLabel = (value: PosterState['size']) =>
  SIZE_OPTIONS.find((option) => option.value === value)?.label ?? 'Square 1080 x 1080'

const getTemplateLabel = (value: PosterState['template']) =>
  TEMPLATE_OPTIONS.find((option) => option.value === value)?.label ?? 'Impact Card'

export default function CreateClient() {
  const { profile } = useProfile()
  const isAdmin = profile?.role === 'admin'
  const [state, setState] = useState<PosterState>(defaultState)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isStoryTemplate = state.template === 'onetree'
  const lockedCopy = {
    title: 'OneTeenOneTree = One Tree',
    subtitle: 'Take the pledge. Plant a tree. Inspire your friends.',
    description: 'Share this to your story and tag OneTeenOneTree to grow the movement.',
  }

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl)
      }
    }
  }, [photoUrl])

  useEffect(() => {
    if (isStoryTemplate && state.size !== 'story') {
      setState((prev) => ({ ...prev, size: 'story' }))
    }
  }, [isStoryTemplate, state.size])

  const updateState = (patch: Partial<PosterState>) => {
    setState((prev) => ({ ...prev, ...patch }))
    if (notice) setNotice('')
  }

  const handlePhotoChange = (file: File | null) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(file ? URL.createObjectURL(file) : null)
    if (file) {
      updateState({ background: 'photo' })
    }
  }

  const storyHasInput = Boolean(state.pledgeName.trim() || photoUrl)
  const canExport = !isStoryTemplate || storyHasInput

  const effectiveTitle = isStoryTemplate ? lockedCopy.title : state.title

  const handleDownload = () => {
    if (!canExport) {
      setNotice('Add your name or a photo to export this story.')
      return
    }
    if (!effectiveTitle.trim()) {
      setNotice('Add a title before exporting.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const templateSlug = slugify(getTemplateLabel(state.template))
    const titleSlug = slugify(effectiveTitle)
    const fileName = `oneteenonetree-${templateSlug}-${titleSlug || 'poster'}.png`
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
  }

  const handleSave = async () => {
    if (!canExport) {
      setNotice('Add your name or a photo to save this story.')
      return
    }
    if (!effectiveTitle.trim()) {
      setNotice('Add a title before saving.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    setIsSaving(true)
    setNotice('')
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (!blob) {
        setNotice('Unable to export the poster. Try again.')
        return
      }
      const templateSlug = slugify(getTemplateLabel(state.template))
      const titleSlug = slugify(effectiveTitle) || 'poster'
      const fileName = `oneteenonetree-${templateSlug}-${titleSlug}.png`
      const formData = new FormData()
      formData.append('file', blob, fileName)
      formData.append('title', effectiveTitle)
      formData.append('template', state.template)
      formData.append('size', state.size)
      formData.append('ctaLink', isStoryTemplate ? '' : state.ctaLink)
      formData.append('city', isStoryTemplate ? '' : state.city)
      formData.append('date', isStoryTemplate ? '' : state.date)

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        setNotice(payload?.error || 'Unable to save right now.')
        return
      }
      setNotice('Saved to gallery.')
    } catch {
      setNotice('Unable to save right now.')
    } finally {
      setIsSaving(false)
    }
  }

  const backgroundLabel = useMemo(
    () =>
      BACKGROUND_OPTIONS.find((option) => option.value === state.background)?.label ?? 'Gradient',
    [state.background]
  )

  const formattedDate = useMemo(() => {
    if (!state.date) return ''
    const parsed = new Date(state.date)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }, [state.date])

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 hero">
        <div className="container text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">Posters &amp; Cards Creator</h1>
          <p className="text-white/70 text-lg">
            Build social-ready visuals for OneTeenOneTree campaigns, volunteer calls, and website
            highlights.
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
            onSave={handleSave}
            canSave={isAdmin}
            isSaving={isSaving}
            notice={notice}
            hasPhoto={Boolean(photoUrl)}
            isStoryTemplate={isStoryTemplate}
            canExport={canExport}
            storyHasInput={storyHasInput}
            pledgeWarning={!state.pledgeChecked && isStoryTemplate}
          />

          <div className="space-y-6">
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold inline-flex items-center gap-2">
                  <Icon name="camera" size={18} aria-hidden="true" />
                  Live preview
                </h2>
                <div className="text-xs text-white/60">
                  {getTemplateLabel(state.template)} | {getSizeLabel(state.size)}
                </div>
              </div>
              <PosterCanvas state={state} photoUrl={photoUrl} canvasRef={canvasRef} />
              {!isStoryTemplate ? (
                <div className="flex flex-wrap gap-2 text-xs text-white/60">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    Background: {backgroundLabel}
                  </span>
                  {state.city ? (
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      City: {state.city}
                    </span>
                  ) : null}
                  {formattedDate ? (
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      Date: {formattedDate}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-2 text-sm text-white/60">
              <p className="font-semibold text-white">Design tips</p>
              <p>
                Keep titles short, use one clear CTA, and choose a photo only when it supports the
                message. The export always keeps safe margins for social platforms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
