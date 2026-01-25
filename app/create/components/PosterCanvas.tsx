'use client'

import { useEffect } from 'react'
import {
  BRAND_STYLE,
  LOCKED_COPY,
  SDG_ICONS,
  SDG_ICON_PATHS,
  SIZE_OPTIONS,
  UN_LOGO_CANDIDATES,
} from '../constants'
import type { PosterState } from '../types'

type PosterCanvasProps = {
  state: PosterState
  photoUrl: string | null
  canvasRef: React.RefObject<HTMLCanvasElement>
}

const getSize = (value: PosterState['size']) => {
  return SIZE_OPTIONS.find((option) => option.value === value) ?? SIZE_OPTIONS[0]
}

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(' ').filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  return lines
}

const clampLines = (lines: string[], maxLines: number) => {
  if (lines.length <= maxLines) return lines
  const trimmed = lines.slice(0, maxLines)
  const last = trimmed[trimmed.length - 1]
  trimmed[trimmed.length - 1] = `${last.replace(/\.*$/, '')}...`
  return trimmed
}

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

const drawCover = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  focus: { focusX?: number; focusY?: number } = {}
) => {
  const focusX = focus.focusX ?? 0.5
  const focusY = focus.focusY ?? 0.2
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  let dx = width / 2 - drawWidth * focusX
  let dy = height / 2 - drawHeight * focusY
  const minX = width - drawWidth
  const minY = height - drawHeight
  dx = Math.min(0, Math.max(dx, minX))
  dy = Math.min(0, Math.max(dy, minY))
  ctx.drawImage(image, dx, dy, drawWidth, drawHeight)
}

const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, size * 0.6)
  ctx.quadraticCurveTo(size * 0.6, size * 0.2, size, size * 0.6)
  ctx.quadraticCurveTo(size * 0.6, size, 0, size * 0.6)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(size * 0.5, size * 0.2)
  ctx.lineTo(size * 0.5, size * 0.95)
  ctx.stroke()
  ctx.restore()
}

const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  minSize: number
) => {
  let currentSize = fontSize
  ctx.font = `${Math.round(currentSize)}px ui-sans-serif, system-ui`
  while (ctx.measureText(text).width > maxWidth && currentSize > minSize) {
    currentSize -= 2
    ctx.font = `${Math.round(currentSize)}px ui-sans-serif, system-ui`
  }
  return currentSize
}

const loadImage = async (src: string) => {
  const img = new Image()
  img.src = src
  await img.decode().catch(() => null)
  if (img.complete && img.naturalWidth > 0) return img
  return null
}

export default function PosterCanvas({ state, photoUrl, canvasRef }: PosterCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width: exportWidth, height: exportHeight } = getSize(state.size)
    const dpr = window.devicePixelRatio || 1
    const scale = exportWidth / 1080
    const padding = 72 * scale

    canvas.width = exportWidth * dpr
    canvas.height = exportHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const logoSizes = {
      square: 150,
      portrait: 170,
      story: 190,
    }
    const titleSizes = {
      square: 64,
      portrait: 70,
      story: 78,
    }
    const subtitleSizes = {
      square: 30,
      portrait: 32,
      story: 34,
    }
    const descSizes = {
      square: 22,
      portrait: 24,
      story: 26,
    }
    const nameSizes = {
      square: 56,
      portrait: 62,
      story: 70,
    }
    const sdgLabelSizes = {
      square: 18,
      portrait: 18,
      story: 20,
    }
    const footerSizes = {
      square: 18,
      portrait: 18,
      story: 20,
    }

    const render = async () => {
      ctx.clearRect(0, 0, exportWidth, exportHeight)
      const centerX = exportWidth / 2

      if (photoUrl) {
        const photo = await loadImage(photoUrl)
        if (photo) {
          drawCover(ctx, photo, exportWidth, exportHeight, { focusX: 0.5, focusY: 0.2 })
        }
      } else {
        const gradient = ctx.createLinearGradient(0, 0, exportWidth, exportHeight)
        gradient.addColorStop(0, BRAND_STYLE.gradient[0])
        gradient.addColorStop(1, BRAND_STYLE.gradient[1])
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, exportWidth, exportHeight)
      }

      const overlayVertical = ctx.createLinearGradient(0, 0, 0, exportHeight)
      overlayVertical.addColorStop(0, 'rgba(6, 18, 12, 0.55)')
      overlayVertical.addColorStop(0.45, 'rgba(6, 18, 12, 0.45)')
      overlayVertical.addColorStop(1, 'rgba(5, 12, 8, 0.82)')
      ctx.fillStyle = overlayVertical
      ctx.fillRect(0, 0, exportWidth, exportHeight)

      const overlayCenter = ctx.createRadialGradient(
        centerX,
        exportHeight * 0.28,
        exportWidth * 0.15,
        centerX,
        exportHeight * 0.28,
        exportWidth * 0.8
      )
      overlayCenter.addColorStop(0, 'rgba(5, 12, 8, 0.35)')
      overlayCenter.addColorStop(1, 'rgba(5, 12, 8, 0)')
      ctx.fillStyle = overlayCenter
      ctx.fillRect(0, 0, exportWidth, exportHeight)

      const logoCandidates = ['/brand/logo.png', '/logo.png']
      let logo: HTMLImageElement | null = null
      for (const src of logoCandidates) {
        logo = await loadImage(src)
        if (logo) break
      }
      const logoSize = logoSizes[state.size] * scale
      const logoY = padding
      if (logo) {
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.shadowBlur = 18 * scale
        ctx.shadowOffsetY = 4 * scale
        ctx.drawImage(logo, centerX - logoSize / 2, logoY, logoSize, logoSize)
        ctx.restore()
      }

      const contentWidth = exportWidth - padding * 2
      let cursorY = logoY + logoSize + 24 * scale

      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0,0,0,0.45)'
      ctx.shadowBlur = 16 * scale
      ctx.shadowOffsetY = 4 * scale
      ctx.font = `700 ${Math.round(titleSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const titleLines = clampLines(wrapText(ctx, LOCKED_COPY.title, contentWidth), 2)
      const titleLineHeight = (titleSizes[state.size] + 12) * scale
      titleLines.forEach((line) => {
        ctx.fillText(line, centerX, cursorY)
        cursorY += titleLineHeight
      })

      ctx.fillStyle = 'rgba(255,255,255,0.88)'
      ctx.font = `500 ${Math.round(subtitleSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const subtitleLines = clampLines(wrapText(ctx, LOCKED_COPY.subtitle, contentWidth), 2)
      const subtitleLineHeight = (subtitleSizes[state.size] + 10) * scale
      cursorY += 8 * scale
      subtitleLines.forEach((line) => {
        ctx.fillText(line, centerX, cursorY)
        cursorY += subtitleLineHeight
      })

      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = `400 ${Math.round(descSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const descLines = clampLines(wrapText(ctx, LOCKED_COPY.description, contentWidth), 2)
      const descLineHeight = (descSizes[state.size] + 8) * scale
      cursorY += 10 * scale
      descLines.forEach((line) => {
        ctx.fillText(line, centerX, cursorY)
        cursorY += descLineHeight
      })

      const footerSize = footerSizes[state.size] * scale
      const footerY = exportHeight - padding
      const sdgLabelSize = sdgLabelSizes[state.size] * scale
      const iconSize = (state.size === 'story' ? 46 : state.size === 'portrait' ? 42 : 40) * scale
      const gap = 12 * scale
      const unSize = 36 * scale
      const totalIconsWidth = SDG_ICONS.length * iconSize + (SDG_ICONS.length - 1) * gap
      const sdgRowWidth = totalIconsWidth + unSize + gap * 2
      const sdgRowY = footerY - footerSize / 2 - 24 * scale - iconSize
      const sdgLabelY = sdgRowY - sdgLabelSize - 10 * scale

      const pledgeName = state.name.trim().slice(0, 60)
      if (pledgeName) {
        const nameText = pledgeName
        const nameMaxWidth = contentWidth
        const baseNameSize = nameSizes[state.size] * scale
        const minNameSize = Math.max(40, baseNameSize - 16)
        const finalNameSize = fitText(ctx, nameText, nameMaxWidth, baseNameSize, minNameSize)
        ctx.font = `700 ${Math.round(finalNameSize)}px ui-sans-serif, system-ui`
        ctx.fillStyle = '#ffffff'
        const nameLineHeight = finalNameSize + 8 * scale
        const nameY = Math.min(
          cursorY + 24 * scale,
          sdgLabelY - nameLineHeight - 18 * scale
        )
        ctx.textBaseline = 'top'
        ctx.fillText(nameText, centerX, nameY)
      }

      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = `500 ${Math.round(sdgLabelSize)}px ui-sans-serif, system-ui`
      ctx.fillText('Aligned with the UN SDGs', centerX, sdgLabelY)

      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      const sdgRowX = centerX - sdgRowWidth / 2
      let iconX = sdgRowX + unSize + gap
      const iconY = sdgRowY

      const iconImages = await Promise.all(
        SDG_ICON_PATHS.map(async (path) => {
          return await loadImage(path)
        })
      )

      let unLogo: HTMLImageElement | null = null
      for (const src of UN_LOGO_CANDIDATES) {
        unLogo = await loadImage(src)
        if (unLogo) break
      }

      if (unLogo) {
        ctx.drawImage(unLogo, sdgRowX, iconY + (iconSize - unSize) / 2, unSize, unSize)
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.beginPath()
        ctx.arc(sdgRowX + unSize / 2, iconY + iconSize / 2, unSize / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.font = `700 ${Math.round(12 * scale)}px ui-sans-serif, system-ui`
        ctx.textBaseline = 'middle'
        ctx.fillText('UN', sdgRowX + unSize / 2, iconY + iconSize / 2)
        ctx.textBaseline = 'top'
      }

      iconImages.forEach((img, index) => {
        if (img) {
          ctx.drawImage(img, iconX, iconY, iconSize, iconSize)
        } else {
          const label = `SDG ${SDG_ICONS[index]}`
          ctx.fillStyle = 'rgba(255,255,255,0.12)'
          drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 8 * scale)
          ctx.fill()
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.font = `600 ${Math.round(10 * scale)}px ui-sans-serif, system-ui`
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.fillText(label, iconX + iconSize / 2, iconY + iconSize / 2)
          ctx.textAlign = 'center'
        }
        iconX += iconSize + gap
      })

      // Admin note: place the official UN logo at /public/brand/un-logo.svg if permitted.

      ctx.shadowColor = 'rgba(0,0,0,0.35)'
      ctx.shadowBlur = 12 * scale
      ctx.shadowOffsetY = 3 * scale

      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.4 * scale
      ctx.fillStyle = BRAND_STYLE.accent
      const footerText = 'oneteenonetree.org'
      ctx.font = `500 ${Math.round(footerSize)}px ui-sans-serif, system-ui`
      const footerTextWidth = ctx.measureText(footerText).width
      const leafSize = 16 * scale
      ctx.textBaseline = 'middle'
      const leafX = centerX - footerTextWidth / 2 - leafSize - 10 * scale
      drawLeaf(ctx, leafX, footerY - 8 * scale, leafSize)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.textAlign = 'center'
      ctx.fillText(footerText, centerX, footerY)
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    render()
  }, [state, photoUrl, canvasRef])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto rounded-2xl border border-white/10 bg-black/20"
      aria-label="Poster preview"
    />
  )
}
