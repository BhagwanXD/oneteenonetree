export type ParsedSocialRow = {
  rowIndex: number
  platform: string
  url: string
  title: string
  postDate: string
  published: string
}

export type ParsedSocialCsv = {
  rows: ParsedSocialRow[]
  totalRows: number
  hasHeader: boolean
}

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

const looksLikeUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://')

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

export const parseSocialCsv = (input: string): ParsedSocialCsv => {
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
  const hasHeader = normalizedHeaders.includes('url')

  const headerMap = new Map<string, number>()
  normalizedHeaders.forEach((header, index) => {
    if (!headerMap.has(header)) {
      headerMap.set(header, index)
    }
  })

  const dataRows = hasHeader ? nonEmptyRows.slice(1) : nonEmptyRows

  const urlOnly = !hasHeader && dataRows.every(({ row }) => row.length === 1 && looksLikeUrl(row[0]))
  const defaultOrder = urlOnly
    ? ['url']
    : ['platform', 'url', 'title', 'post_date', 'published']

  const getValue = (row: string[], key: string) => {
    if (hasHeader) {
      const idx = headerMap.get(key)
      return idx === undefined ? '' : row[idx] ?? ''
    }
    const idx = defaultOrder.indexOf(key)
    return idx === -1 ? '' : row[idx] ?? ''
  }

  const rows: ParsedSocialRow[] = dataRows.map(({ row, line }) => ({
    rowIndex: line,
    platform: getValue(row, 'platform'),
    url: getValue(row, 'url'),
    title: getValue(row, 'title'),
    postDate: getValue(row, 'post_date'),
    published: getValue(row, 'published'),
  }))

  return { rows, totalRows: rows.length, hasHeader }
}
