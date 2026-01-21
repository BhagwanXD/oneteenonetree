import fs from 'node:fs/promises'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  MdOutlineArrowForward,
  MdOutlineCalendarMonth,
  MdOutlineChecklist,
  MdOutlineChevronRight,
  MdOutlineClose,
  MdOutlineDashboard,
  MdOutlineDelete,
  MdOutlineDownload,
  MdOutlineEco,
  MdOutlineEmojiEvents,
  MdOutlineEdit,
  MdOutlineExpandMore,
  MdOutlineGroups,
  MdOutlineHelpOutline,
  MdOutlineInfo,
  MdOutlineLink,
  MdOutlineLocationOn,
  MdOutlineLock,
  MdOutlineMailOutline,
  MdOutlineMenu,
  MdOutlineOpenInNew,
  MdOutlinePerson,
  MdOutlinePhotoCamera,
  MdOutlineSearch,
  MdOutlineSettings,
  MdOutlineShield,
  MdOutlineSmartphone,
  MdOutlineSync,
  MdOutlineUpload,
  MdOutlineVerified,
  MdOutlineVolunteerActivism,
  MdOutlineLeaderboard,
  MdOutlineShare,
  MdOutlineArticle,
  MdOutlineNewspaper,
  MdOutlineSportsEsports,
} from 'react-icons/md'

const icons = [
  'menu',
  'close',
  'expand_more',
  'chevron_right',
  'arrow_forward',
  'open_in_new',
  'search',
  'info',
  'help',
  'lock',
  'shield',
  'verified',
  'mail',
  'eco',
  'volunteer_activism',
  'groups',
  'location_on',
  'calendar_month',
  'photo_camera',
  'person',
  'leaderboard',
  'share',
  'article',
  'newspaper',
  'sports_esports',
  'dashboard',
  'settings',
  'upload',
  'checklist',
  'link',
  'sync',
  'delete',
  'download',
  'emoji_events',
  'edit',
  'smartphone',
]

const baseUrl =
  'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined'

const fallbackMap = {
  menu: MdOutlineMenu,
  close: MdOutlineClose,
  expand_more: MdOutlineExpandMore,
  chevron_right: MdOutlineChevronRight,
  arrow_forward: MdOutlineArrowForward,
  open_in_new: MdOutlineOpenInNew,
  search: MdOutlineSearch,
  info: MdOutlineInfo,
  help: MdOutlineHelpOutline,
  lock: MdOutlineLock,
  shield: MdOutlineShield,
  verified: MdOutlineVerified,
  mail: MdOutlineMailOutline,
  eco: MdOutlineEco,
  volunteer_activism: MdOutlineVolunteerActivism,
  groups: MdOutlineGroups,
  location_on: MdOutlineLocationOn,
  calendar_month: MdOutlineCalendarMonth,
  photo_camera: MdOutlinePhotoCamera,
  person: MdOutlinePerson,
  leaderboard: MdOutlineLeaderboard,
  share: MdOutlineShare,
  article: MdOutlineArticle,
  newspaper: MdOutlineNewspaper,
  sports_esports: MdOutlineSportsEsports,
  dashboard: MdOutlineDashboard,
  settings: MdOutlineSettings,
  upload: MdOutlineUpload,
  checklist: MdOutlineChecklist,
  link: MdOutlineLink,
  sync: MdOutlineSync,
  delete: MdOutlineDelete,
  download: MdOutlineDownload,
  emoji_events: MdOutlineEmojiEvents,
  edit: MdOutlineEdit,
  smartphone: MdOutlineSmartphone,
}

const toPascalCase = (name) =>
  name
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const normalizeSvgInner = (svg) => {
  const inner = svg
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .trim()
  return inner
    .replace(/fill=\"none\"/gi, 'data-fill-none="true"')
    .replace(/\s(fill|stroke|style)=\"[^\"]*\"/gi, '')
    .replace(/data-fill-none=\"true\"/g, 'fill="none"')
}

const buildSvg = (inner) =>
  [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">',
    inner,
    '</svg>',
  ].join('')

const buildComponent = (componentName, inner) => `import * as React from 'react'

export default function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  const { children, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
      ${inner}
    </svg>
  )
}
`

const fetchIcon = async (name) => {
  const url = `${baseUrl}/${name}/default/24px.svg`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch ${name}: ${res.status}`)
    }
    return res.text()
  } catch (error) {
    const fallback = fallbackMap[name]
    if (!fallback) {
      throw error
    }
    const svg = renderToStaticMarkup(createElement(fallback))
    return svg
  }
}

const writeFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
}

const run = async () => {
  const root = process.cwd()
  const svgDir = path.join(root, 'public', 'icons', 'material')
  const componentDir = path.join(root, 'components', 'icons', 'material')

  for (const name of icons) {
    const raw = await fetchIcon(name)
    const inner = normalizeSvgInner(raw)
    const svg = buildSvg(inner)
    const componentName = `${toPascalCase(name)}Icon`
    const component = buildComponent(componentName, inner)

    await writeFile(path.join(svgDir, `${name}.svg`), svg)
    await writeFile(path.join(componentDir, `${componentName}.tsx`), component)
    process.stdout.write(`✓ ${name}\n`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
