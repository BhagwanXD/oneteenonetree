export type ParsedGalleryRow = {
  rowIndex: number
  imagePath: string
  caption: string
  city: string
  year: string
  driveType: string
  isPublished: string
  sortOrder: string
  takenAt: string
}

export type ParsedGalleryCsv = {
  rows: ParsedGalleryRow[]
  totalRows: number
  hasHeader: boolean
}

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

const parseCsvRows = (input: string) => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    if (char === '\r') {
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

export const parseGalleryCsv = (input: string): ParsedGalleryCsv => {
  const rawRows = parseCsvRows(input)
  const trimmedRows = rawRows.map((row, index) => ({
    row: row.map((cell) => cell.trim()),
    line: index + 1,
  }))

  const nonEmptyRows = trimmedRows.filter(({ row }) => row.some((cell) => cell !== ''))
  if (nonEmptyRows.length === 0) {
    return { rows: [], totalRows: 0, hasHeader: false }
  }

  const headerCandidate = nonEmptyRows[0]
  const normalizedHeaders = headerCandidate.row.map(normalizeHeader)
  const hasHeader = normalizedHeaders.includes('image_path')

  const headerMap = new Map<string, number>()
  normalizedHeaders.forEach((header, index) => {
    if (!headerMap.has(header)) {
      headerMap.set(header, index)
    }
  })

  const dataRows = hasHeader ? nonEmptyRows.slice(1) : nonEmptyRows
  const defaultOrder = [
    'image_path',
    'caption',
    'city',
    'year',
    'drive_type',
    'is_published',
    'sort_order',
    'taken_at',
  ]

  const getValue = (row: string[], key: string) => {
    if (hasHeader) {
      const idx = headerMap.get(key)
      return idx === undefined ? '' : row[idx] ?? ''
    }
    const idx = defaultOrder.indexOf(key)
    return idx === -1 ? '' : row[idx] ?? ''
  }

  const rows: ParsedGalleryRow[] = dataRows.map(({ row, line }) => ({
    rowIndex: line,
    imagePath: getValue(row, 'image_path'),
    caption: getValue(row, 'caption'),
    city: getValue(row, 'city'),
    year: getValue(row, 'year'),
    driveType: getValue(row, 'drive_type'),
    isPublished: getValue(row, 'is_published'),
    sortOrder: getValue(row, 'sort_order'),
    takenAt: getValue(row, 'taken_at'),
  }))

  return { rows, totalRows: rows.length, hasHeader }
}
