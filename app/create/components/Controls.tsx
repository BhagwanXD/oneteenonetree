'use client'

import Icon from '@/components/Icon'
import { SIZE_OPTIONS } from '../constants'
import type { PosterState } from '../types'

type ControlsProps = {
  state: PosterState
  onChange: (patch: Partial<PosterState>) => void
  onPhotoChange: (file: File | null) => void
  onDownload: () => void
  notice: string
  hasPhoto: boolean
  missingName: boolean
  canExport: boolean
}

const optionClass = (active: boolean) =>
  `rounded-2xl border px-3 py-2 text-sm text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${
    active
      ? 'border-white/30 bg-white/10 text-white'
      : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
  }`

export default function Controls({
  state,
  onChange,
  onPhotoChange,
  onDownload,
  notice,
  hasPhoto,
  missingName,
  canExport,
}: ControlsProps) {
  const showInputError = missingName

  return (
    <div className="card space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold inline-flex items-center gap-2">
          <Icon name="edit" size={18} aria-hidden="true" />
          Create your story card
        </h2>
        <p className="text-sm text-white/60">
          Add your name and optionally a photo, then download your poster.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">Export size</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={optionClass(state.size === option.value)}
              onClick={() => onChange({ size: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="text-sm space-y-2" htmlFor="pledge-name">
        <span className="text-white/70">Your name</span>
        <input
          id="pledge-name"
          name="pledge-name"
          maxLength={80}
          value={state.name}
          onChange={(event) => onChange({ name: event.target.value })}
          aria-invalid={showInputError && missingName}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
          placeholder="Your name"
        />
        {showInputError && missingName ? (
          <span className="text-xs text-rose-200">Please add your name.</span>
        ) : null}
      </label>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <label className="text-sm space-y-2" htmlFor="story-photo">
          <span className="text-white/70 inline-flex items-center gap-2">
            <Icon name="camera" size={16} aria-hidden="true" />
            Upload a photo (optional)
          </span>
          <input
            id="story-photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              onPhotoChange(file)
            }}
            className="w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20"
          />
        </label>
        {hasPhoto ? (
          <button
            type="button"
            className="text-xs text-white/60 hover:text-white transition"
            onClick={() => onPhotoChange(null)}
          >
            Remove photo
          </button>
        ) : null}
      </div>

      <p className="text-xs text-white/50">
        Optional photo helps personalize the story card.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          className="btn px-5 py-2"
          onClick={onDownload}
          disabled={!canExport}
        >
          <Icon name="download" size={18} aria-hidden="true" />
          Download story card
        </button>
        {notice ? (
          <p className="text-xs text-white/60" role="status" aria-live="polite">
            {notice}
          </p>
        ) : missingName ? (
          <p className="text-xs text-white/50">Add your name to enable export.</p>
        ) : (
          <p className="text-xs text-white/50">Ready to download.</p>
        )}
      </div>
    </div>
  )
}
