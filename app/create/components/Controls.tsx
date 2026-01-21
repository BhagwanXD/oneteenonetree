'use client'

import Icon from '@/components/Icon'
import { BACKGROUND_OPTIONS, SIZE_OPTIONS, TEMPLATE_OPTIONS } from '../constants'
import type { PosterState } from '../types'

type ControlsProps = {
  state: PosterState
  onChange: (patch: Partial<PosterState>) => void
  onPhotoChange: (file: File | null) => void
  onDownload: () => void
  onSave: () => void
  canSave: boolean
  isSaving: boolean
  notice: string
  hasPhoto: boolean
  isStoryTemplate: boolean
  canExport: boolean
  storyHasInput: boolean
  pledgeWarning: boolean
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
  onSave,
  canSave,
  isSaving,
  notice,
  hasPhoto,
  isStoryTemplate,
  canExport,
  storyHasInput,
  pledgeWarning,
}: ControlsProps) {
  const descriptionCount = state.description.length

  if (isStoryTemplate) {
    return (
      <div className="card space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold inline-flex items-center gap-2">
            <Icon name="edit" size={18} aria-hidden="true" />
            OneTeenOneTree = One Tree (Story)
          </h2>
          <p className="text-sm text-white/60">
            Add your name or a photo, then download your story.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-white/60">Template</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {TEMPLATE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={optionClass(state.template === option.value)}
                onClick={() => onChange({ template: option.value })}
              >
                <div className="text-sm font-semibold text-white">{option.label}</div>
                <div className="text-xs text-white/60 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm space-y-2" htmlFor="pledge-name">
          <span className="text-white/70">Your name (required if no photo)</span>
          <input
            id="pledge-name"
            name="pledge-name"
            maxLength={80}
            value={state.pledgeName}
            onChange={(event) => onChange({ pledgeName: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="Your name"
          />
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <label className="text-sm space-y-2" htmlFor="story-photo">
            <span className="text-white/70 inline-flex items-center gap-2">
              <Icon name="camera" size={16} aria-hidden="true" />
              Upload a photo (required if no name)
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

        <label className="inline-flex items-start gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={state.pledgeChecked}
            onChange={(event) => onChange({ pledgeChecked: event.target.checked })}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--acc)] focus:ring-[var(--acc)]"
          />
          I pledge to plant a tree
        </label>
        {pledgeWarning ? (
          <p className="text-xs text-amber-200">
            Reminder: Checking the pledge helps reinforce the message, but you can still export.
          </p>
        ) : null}

        {!storyHasInput ? (
          <p className="text-xs text-rose-200">
            Please add your name or a photo to download this story.
          </p>
        ) : null}

        <p className="text-xs text-white/50">
          Quick tip: Portrait photos with clean backgrounds keep the message readable.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            className="btn px-5 py-2"
            onClick={onDownload}
            disabled={!canExport}
          >
            <Icon name="download" size={18} aria-hidden="true" />
            Download Story
          </button>
          {canSave ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
              onClick={onSave}
              disabled={isSaving || !canExport}
            >
              <Icon name="upload" size={18} aria-hidden="true" />
              {isSaving ? 'Saving...' : 'Save to Gallery (admin)'}
            </button>
          ) : null}
          {notice ? (
            <p className="text-xs text-white/60" role="status" aria-live="polite">
              {notice}
            </p>
          ) : (
            <p className="text-xs text-white/50">
              Downloading is available to everyone. Gallery save is admin-only.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card space-y-7">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold inline-flex items-center gap-2">
          <Icon name="edit" size={18} aria-hidden="true" />
          Create your poster
        </h2>
        <p className="text-sm text-white/60">
          Keep it short and focused. Everything updates in the live preview.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">Template</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {TEMPLATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={optionClass(state.template === option.value)}
              onClick={() => onChange({ template: option.value })}
            >
              <div className="text-sm font-semibold text-white">{option.label}</div>
              <div className="text-xs text-white/60 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
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

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">Headline</p>
        <label className="text-sm space-y-2" htmlFor="poster-title">
          <span className="text-white/70">Title (required)</span>
          <input
            id="poster-title"
            name="title"
            required
            maxLength={80}
            value={state.title}
            onChange={(event) => onChange({ title: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="Planting drive highlights"
          />
        </label>
        <label className="text-sm space-y-2" htmlFor="poster-subtitle">
          <span className="text-white/70">Subtitle (optional)</span>
          <input
            id="poster-subtitle"
            name="subtitle"
            maxLength={120}
            value={state.subtitle}
            onChange={(event) => onChange({ subtitle: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="Student-led climate action"
          />
        </label>
        <label className="text-sm space-y-2" htmlFor="poster-description">
          <span className="text-white/70">Short description (optional)</span>
          <textarea
            id="poster-description"
            name="description"
            rows={3}
            maxLength={180}
            value={state.description}
            onChange={(event) => onChange({ description: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            placeholder="Share the drive result, who joined, or what comes next."
          />
        </label>
        <p className="text-xs text-white/50">{descriptionCount}/180 characters</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">CTA & context</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm space-y-2" htmlFor="poster-cta">
            <span className="text-white/70">CTA button text (optional)</span>
            <input
              id="poster-cta"
              name="cta"
              maxLength={40}
              value={state.ctaText}
              onChange={(event) => onChange({ ctaText: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="Join the pledge"
            />
          </label>
          <label className="text-sm space-y-2" htmlFor="poster-link">
            <span className="text-white/70">CTA link (optional)</span>
            <input
              id="poster-link"
              name="cta-link"
              value={state.ctaLink}
              onChange={(event) => onChange({ ctaLink: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="https://oneteenonetree.org/pledge"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm space-y-2" htmlFor="poster-city">
            <span className="text-white/70 inline-flex items-center gap-2">
              <Icon name="location" size={16} aria-hidden="true" />
              Location / City (optional)
            </span>
            <input
              id="poster-city"
              name="city"
              maxLength={80}
              value={state.city}
              onChange={(event) => onChange({ city: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
              placeholder="Bengaluru"
            />
          </label>
          <label className="text-sm space-y-2" htmlFor="poster-date">
            <span className="text-white/70 inline-flex items-center gap-2">
              <Icon name="calendar" size={16} aria-hidden="true" />
              Date (optional)
            </span>
            <input
              id="poster-date"
              name="date"
              type="date"
              value={state.date}
              onChange={(event) => onChange({ date: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">Background</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {BACKGROUND_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={optionClass(state.background === option.value)}
              onClick={() => onChange({ background: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
        {state.background === 'photo' ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <label className="text-sm space-y-2" htmlFor="poster-photo">
              <span className="text-white/70 inline-flex items-center gap-2">
                <Icon name="camera" size={16} aria-hidden="true" />
                Upload a background photo
              </span>
              <input
                id="poster-photo"
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
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">Export</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" className="btn px-5 py-2" onClick={onDownload}>
            <Icon name="download" size={18} aria-hidden="true" />
            Download PNG
          </button>
          {canSave ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
              onClick={onSave}
              disabled={isSaving}
            >
              <Icon name="upload" size={18} aria-hidden="true" />
              {isSaving ? 'Saving...' : 'Save to Gallery (admin)'}
            </button>
          ) : null}
        </div>
        {notice ? (
          <p className="text-xs text-white/60" role="status" aria-live="polite">
            {notice}
          </p>
        ) : (
          <p className="text-xs text-white/50">
            Downloading is available to everyone. Gallery save is admin-only.
          </p>
        )}
      </div>
    </div>
  )
}
