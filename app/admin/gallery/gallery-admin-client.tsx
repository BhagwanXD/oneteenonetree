'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { parseGalleryCsv } from '@/lib/gallery/csv'
import Icon from '@/components/Icon'

type GalleryItem = {
  id: string
  image_path: string
  media_type?: 'image' | 'video' | null
  caption: string | null
  city: string | null
  year: number | null
  drive_type: string | null
  is_published: boolean
  sort_order: number | null
  taken_at: string | null
  created_at: string
}

type UploadError = { name: string; reason: string }
type CsvFailure = { row: number; reason: string }

const driveTypeOptions = [
  'Plantation Drive',
  'School Drive',
  'Community Drive',
  'Mangrove Drive',
  'Other',
]

const resolveMediaUrl = (supabase: any, mediaPath: string) => {
  if (!mediaPath) return ''
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath
  }
  const { data } = supabase.storage.from('gallery').getPublicUrl(mediaPath)
  return data?.publicUrl ?? ''
}

const parseBoolean = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return null
  if (['true', 'yes', '1'].includes(normalized)) return true
  if (['false', 'no', '0'].includes(normalized)) return false
  return null
}

export default function GalleryAdminClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const supabase = createClientComponentClient()
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [notice, setNotice] = useState<string>('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileCaptions, setFileCaptions] = useState<string[]>([])
  const [defaults, setDefaults] = useState({
    caption: '',
    city: '',
    year: '',
    driveType: '',
    published: true,
    sortOrder: '0',
    takenAt: '',
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [csvContent, setCsvContent] = useState('')
  const [csvPreview, setCsvPreview] = useState<ReturnType<typeof parseGalleryCsv> | null>(null)
  const [csvError, setCsvError] = useState('')
  const [csvSummary, setCsvSummary] = useState<{
    total: number
    imported: number
    failed: CsvFailure[]
  } | null>(null)
  const [csvPublishedDefault, setCsvPublishedDefault] = useState(true)

  useEffect(() => {
    if (!csvContent.trim()) {
      setCsvPreview(null)
      setCsvError('')
      return
    }
    try {
      const parsed = parseGalleryCsv(csvContent)
      setCsvPreview(parsed)
      if (parsed.totalRows > 200) {
        setCsvError('Limit is 200 rows per import.')
      } else {
        setCsvError('')
      }
    } catch {
      setCsvPreview(null)
      setCsvError('Could not parse CSV. Please check formatting.')
    }
  }, [csvContent])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setSelectedFiles(files)
    setFileCaptions(files.map(() => ''))
    setNotice('')
    setUploadErrors([])
  }

  const updateItemField = <K extends keyof GalleryItem>(
    id: string,
    field: K,
    value: GalleryItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleUpload = async () => {
    setNotice('')
    setUploadErrors([])
    if (selectedFiles.length === 0) {
      setNotice('Select at least one file to upload.')
      return
    }
    if (defaults.year && Number.isNaN(Number.parseInt(defaults.year, 10))) {
      setNotice('Year must be a number.')
      return
    }
    if (defaults.sortOrder && Number.isNaN(Number.parseInt(defaults.sortOrder, 10))) {
      setNotice('Sort order must be a number.')
      return
    }

    setUploading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const createdBy = user?.id ?? null
    const uploaded: GalleryItem[] = []
    const failures: UploadError[] = []

    for (let index = 0; index < selectedFiles.length; index += 1) {
      const file = selectedFiles[index]
      setUploadProgress({ current: index + 1, total: selectedFiles.length })

      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        failures.push({ name: file.name, reason: 'Unsupported file type.' })
        continue
      }

      const ext = file.name.split('.').pop() || 'jpg'
      const safeExt = ext.length > 5 ? 'jpg' : ext
      const mediaType: GalleryItem['media_type'] = isVideo ? 'video' : 'image'
      const yearSegment = new Date().getFullYear()
      const path = `gallery/${yearSegment}/${crypto.randomUUID()}.${safeExt}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        failures.push({ name: file.name, reason: uploadError.message })
        continue
      }

      const caption = fileCaptions[index]?.trim() || defaults.caption.trim() || null
      const year = defaults.year ? Number.parseInt(defaults.year, 10) : null
      const sortOrder = defaults.sortOrder ? Number.parseInt(defaults.sortOrder, 10) : 0
      const insertPayload = {
        image_path: path,
        media_type: mediaType,
        caption,
        city: defaults.city.trim() || null,
        year,
        drive_type: defaults.driveType.trim() || null,
        is_published: defaults.published,
        sort_order: sortOrder,
        taken_at: defaults.takenAt || null,
        created_by: createdBy,
      }

      const { data, error } = await supabase
        .from('gallery_items')
        .insert(insertPayload)
        .select(
          'id, image_path, media_type, caption, city, year, drive_type, is_published, sort_order, taken_at, created_at'
        )
        .single()

      if (error) {
        failures.push({ name: file.name, reason: error.message })
        await supabase.storage.from('gallery').remove([path])
        continue
      }

      if (data) uploaded.push(data as GalleryItem)
    }

    setItems((prev) => [...uploaded, ...prev])
    setUploading(false)
    setUploadProgress({ current: 0, total: 0 })
    setUploadErrors(failures)
    setSelectedFiles([])
    setFileCaptions([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (uploaded.length > 0) {
      setNotice(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? '' : 's'}.`)
    } else if (failures.length > 0) {
      setNotice('No files uploaded. Please review the errors.')
    }
  }

  const handleUpdate = async (item: GalleryItem) => {
    setNotice('')
    setBusyId(item.id)
    const { data, error } = await supabase
      .from('gallery_items')
      .update({
        caption: item.caption,
        city: item.city,
        year: item.year,
        drive_type: item.drive_type,
        is_published: item.is_published,
        sort_order: item.sort_order ?? 0,
        taken_at: item.taken_at,
      })
      .eq('id', item.id)
      .select(
        'id, image_path, media_type, caption, city, year, drive_type, is_published, sort_order, taken_at, created_at'
      )
      .single()

    setBusyId(null)
    if (error) {
      setNotice(error.message || 'Failed to update item.')
      return
    }
    if (data) {
      setItems((prev) => prev.map((row) => (row.id === item.id ? (data as GalleryItem) : row)))
      setNotice('Gallery item updated.')
    }
  }

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm('Delete this photo? This cannot be undone.')) return
    setNotice('')
    setBusyId(item.id)
    const { error } = await supabase.from('gallery_items').delete().eq('id', item.id)
    if (!error && item.image_path && !item.image_path.startsWith('http')) {
      await supabase.storage.from('gallery').remove([item.image_path])
    }
    setBusyId(null)
    if (error) {
      setNotice(error.message || 'Failed to delete photo.')
      return
    }
    setItems((prev) => prev.filter((row) => row.id !== item.id))
    setNotice('Photo deleted.')
  }

  const handleCsvFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please upload a .csv file.')
      return
    }
    const text = await file.text()
    setCsvContent(text)
    setCsvSummary(null)
  }

  const handleCsvImport = async () => {
    if (!csvContent.trim() || !csvPreview) {
      setCsvError('Upload a CSV file first.')
      return
    }
    if (csvPreview.totalRows > 200) {
      setCsvError('Limit is 200 rows per import.')
      return
    }
    setCsvError('')
    setCsvSummary(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const createdBy = user?.id ?? null

    const failures: CsvFailure[] = []
    const inserted: GalleryItem[] = []

    for (const row of csvPreview.rows) {
      const imagePath = row.imagePath.trim()
      if (!imagePath) {
        failures.push({ row: row.rowIndex, reason: 'Missing image_path.' })
        continue
      }
      const year = row.year ? Number.parseInt(row.year, 10) : null
      if (row.year && Number.isNaN(year)) {
        failures.push({ row: row.rowIndex, reason: 'Invalid year.' })
        continue
      }
      const sortOrder = row.sortOrder ? Number.parseInt(row.sortOrder, 10) : 0
      if (row.sortOrder && Number.isNaN(sortOrder)) {
        failures.push({ row: row.rowIndex, reason: 'Invalid sort_order.' })
        continue
      }
      const parsedPublish = parseBoolean(row.isPublished)
      const isPublished = parsedPublish ?? csvPublishedDefault

      let takenAt: string | null = row.takenAt.trim() || null
      if (takenAt) {
        const parsed = new Date(takenAt)
        if (Number.isNaN(parsed.getTime())) {
          failures.push({ row: row.rowIndex, reason: 'Invalid taken_at date.' })
          continue
        }
        takenAt = parsed.toISOString().slice(0, 10)
      }

      const insertPayload = {
        image_path: imagePath,
        media_type: 'image' as const,
        caption: row.caption.trim() || null,
        city: row.city.trim() || null,
        year,
        drive_type: row.driveType.trim() || null,
        is_published: isPublished,
        sort_order: sortOrder,
        taken_at: takenAt,
        created_by: createdBy,
      }

      const { data, error } = await supabase
        .from('gallery_items')
        .insert(insertPayload)
        .select(
          'id, image_path, media_type, caption, city, year, drive_type, is_published, sort_order, taken_at, created_at'
        )
        .single()

      if (error) {
        failures.push({ row: row.rowIndex, reason: error.message })
        continue
      }
      if (data) inserted.push(data as GalleryItem)
    }

    setItems((prev) => [...inserted, ...prev])
    setCsvSummary({
      total: csvPreview.totalRows,
      imported: inserted.length,
      failed: failures,
    })
    setCsvContent('')
    setCsvPreview(null)
  }

  const mediaUrls = useMemo(() => {
    const map = new Map<string, string>()
    items.forEach((item) => {
      map.set(item.id, resolveMediaUrl(supabase, item.image_path))
    })
    return map
  }, [items, supabase])

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Admin — Gallery Manager</h1>
        <p className="text-white/60 text-sm">
          Upload gallery photos or videos and manage public visibility.
        </p>
      </div>

      {notice ? (
        <div className="text-sm text-white/70" role="status">
          {notice}
        </div>
      ) : null}

      <div className="card space-y-4">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <Icon name="upload" size={18} aria-hidden="true" />
          Upload media
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            Default caption (optional)
            <input
              type="text"
              value={defaults.caption}
              onChange={(event) => setDefaults((prev) => ({ ...prev, caption: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            City
            <input
              type="text"
              value={defaults.city}
              onChange={(event) => setDefaults((prev) => ({ ...prev, city: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            Year
            <input
              type="number"
              value={defaults.year}
              onChange={(event) => setDefaults((prev) => ({ ...prev, year: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            Drive type
            <select
              value={defaults.driveType}
              onChange={(event) =>
                setDefaults((prev) => ({ ...prev, driveType: event.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            >
              <option value="">Select drive type</option>
              {driveTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/70">
            Sort order
            <input
              type="number"
              value={defaults.sortOrder}
              onChange={(event) =>
                setDefaults((prev) => ({ ...prev, sortOrder: event.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            Taken at (optional)
            <input
              type="date"
              value={defaults.takenAt}
              onChange={(event) =>
                setDefaults((prev) => ({ ...prev, takenAt: event.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={defaults.published}
              onChange={(event) =>
                setDefaults((prev) => ({ ...prev, published: event.target.checked }))
              }
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--acc)] focus:ring-[var(--acc)]"
            />
            Publish immediately
          </label>
        </div>

        <label className="space-y-2 text-sm text-white/70">
          Select media files (images or videos)
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white"
          />
        </label>

        {selectedFiles.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-white/60">
              {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected.
            </div>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}`}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="text-sm text-white/70">{file.name}</div>
                  <input
                    type="text"
                    placeholder="Caption override (optional)"
                    value={fileCaptions[index] ?? ''}
                    onChange={(event) =>
                      setFileCaptions((prev) =>
                        prev.map((value, idx) => (idx === index ? event.target.value : value))
                      )
                    }
                    className="w-full md:w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <button type="button" onClick={handleUpload} disabled={uploading} className="btn">
          {uploading
            ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
            : 'Upload media'}
        </button>

        {uploadErrors.length > 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70 space-y-2">
            <div className="font-semibold text-white">Upload issues</div>
            {uploadErrors.map((error) => (
              <div key={`${error.name}-${error.reason}`}>
                {error.name}: {error.reason}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="card space-y-4">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <Icon name="download" size={18} aria-hidden="true" />
          Bulk import via CSV
        </div>
        <p className="text-sm text-white/60">
          Use this for images already uploaded to Supabase Storage. Download the template to format
          your data.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/templates/gallery_import.csv" download className="btn">
            Download CSV template
          </a>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvFile}
          className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white"
        />
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={csvPublishedDefault}
            onChange={(event) => setCsvPublishedDefault(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--acc)] focus:ring-[var(--acc)]"
          />
          Publish by default when is_published is blank
        </label>

        {csvError ? <div className="text-sm text-amber-200">{csvError}</div> : null}
        {csvPreview ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2 text-sm">
            <div className="text-white/70">
              {csvPreview.totalRows} row{csvPreview.totalRows === 1 ? '' : 's'} detected.
            </div>
            <div className="grid gap-2">
              {csvPreview.rows.slice(0, 5).map((row) => (
                <div key={row.rowIndex} className="text-white/60">
                  Row {row.rowIndex}: {row.imagePath || 'Missing image_path'}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <button type="button" onClick={handleCsvImport} className="btn">
          Import CSV
        </button>

        {csvSummary ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70 space-y-2">
            <div>
              Imported {csvSummary.imported} of {csvSummary.total} rows.
            </div>
            {csvSummary.failed.length > 0 ? (
              <div className="space-y-1">
                {csvSummary.failed.map((failure) => (
                  <div key={`${failure.row}-${failure.reason}`}>
                    Row {failure.row}: {failure.reason}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Gallery items</h2>
        {items.length === 0 ? (
          <div className="card">No gallery media yet.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card space-y-4">
                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                  <div className="h-32 w-full overflow-hidden rounded-xl bg-black/20">
                    {mediaUrls.get(item.id) ? (
                      item.media_type === 'video' ? (
                        <video
                          src={mediaUrls.get(item.id)}
                          className="h-full w-full object-cover"
                          controls
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={mediaUrls.get(item.id)}
                          alt={item.caption || 'Gallery media'}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/60">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1 text-xs text-white/60">
                      Caption
                      <input
                        type="text"
                        value={item.caption ?? ''}
                        onChange={(event) =>
                          updateItemField(item.id, 'caption', event.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-white/60">
                      City
                      <input
                        type="text"
                        value={item.city ?? ''}
                        onChange={(event) => updateItemField(item.id, 'city', event.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-white/60">
                      Year
                      <input
                        type="number"
                        value={item.year ?? ''}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            'year',
                            event.target.value ? Number(event.target.value) : null
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-white/60">
                      Drive type
                      <input
                        type="text"
                        value={item.drive_type ?? ''}
                        onChange={(event) =>
                          updateItemField(item.id, 'drive_type', event.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-white/60">
                      Sort order
                      <input
                        type="number"
                        value={item.sort_order ?? 0}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            'sort_order',
                            Number.isNaN(Number(event.target.value))
                              ? 0
                              : Number(event.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="space-y-1 text-xs text-white/60">
                      Taken at
                      <input
                        type="date"
                        value={item.taken_at ?? ''}
                        onChange={(event) =>
                          updateItemField(item.id, 'taken_at', event.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={item.is_published}
                        onChange={(event) =>
                          updateItemField(item.id, 'is_published', event.target.checked)
                        }
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--acc)] focus:ring-[var(--acc)]"
                      />
                      Published
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(item)}
                    disabled={busyId === item.id}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white disabled:opacity-60"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={busyId === item.id}
                    className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-sm text-white disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    <Icon name="delete" size={16} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
