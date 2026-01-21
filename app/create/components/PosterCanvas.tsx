'use client'

import { useEffect } from 'react'
import { BRAND_STYLE, LOCKED_COPY, SDG_ICONS, SIZE_OPTIONS } from '../constants'
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
      square: 130,
      portrait: 140,
      story: 160,
    }
    const brandTextSizes = {
      square: 42,
      portrait: 46,
      story: 52,
    }
    const titleSizes = {
      square: 60,
      portrait: 66,
      story: 74,
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
      square: 60,
      portrait: 64,
      story: 72,
    }

    const render = async () => {
      ctx.clearRect(0, 0, exportWidth, exportHeight)

      if (photoUrl) {
        const photo = new Image()
        photo.src = photoUrl
        await photo.decode().catch(() => null)
        if (photo.complete && photo.naturalWidth > 0) {
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
      overlayVertical.addColorStop(0, 'rgba(6, 18, 12, 0.35)')
      overlayVertical.addColorStop(1, 'rgba(5, 12, 8, 0.9)')
      ctx.fillStyle = overlayVertical
      ctx.fillRect(0, 0, exportWidth, exportHeight)

      const overlayLeft = ctx.createLinearGradient(0, 0, exportWidth, 0)
      overlayLeft.addColorStop(0, 'rgba(5, 12, 8, 0.85)')
      overlayLeft.addColorStop(0.6, 'rgba(5, 12, 8, 0.35)')
      overlayLeft.addColorStop(1, 'rgba(5, 12, 8, 0.1)')
      ctx.fillStyle = overlayLeft
      ctx.fillRect(0, 0, exportWidth, exportHeight)

      const logo = new Image()
      logo.src = '/logo.png'
      await logo.decode().catch(() => null)
      const logoSize = logoSizes[state.size] * scale
      const logoBox = logoSize + 24 * scale
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      drawRoundedRect(ctx, padding, padding, logoBox, logoBox, 20 * scale)
      ctx.fill()
      if (logo.complete && logo.naturalWidth > 0) {
        ctx.drawImage(
          logo,
          padding + (logoBox - logoSize) / 2,
          padding + (logoBox - logoSize) / 2,
          logoSize,
          logoSize
        )
      }

      ctx.fillStyle = '#ffffff'
      ctx.textBaseline = 'middle'
      ctx.font = `700 ${Math.round(brandTextSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const brandTextX = padding + logoBox + 18 * scale
      const brandTextY = padding + logoBox / 2
      ctx.fillText('OneTeenOneTree', brandTextX, brandTextY)

      const contentStart = padding + logoBox + 42 * scale
      const contentWidth = Math.min(exportWidth * 0.66, exportWidth - padding * 2)
      const panelX = padding - 12 * scale
      const panelY = contentStart - 24 * scale
      const safeBottomY = exportHeight - padding - 220 * scale
      const panelHeight = Math.max(200 * scale, safeBottomY - panelY)
      const panelWidth = contentWidth + 56 * scale
      ctx.fillStyle = 'rgba(6, 15, 10, 0.55)'
      drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 24 * scale)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1 * scale
      ctx.stroke()
      let cursorY = contentStart

      ctx.textBaseline = 'top'
      ctx.fillStyle = '#ffffff'
      ctx.font = `700 ${Math.round(titleSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const titleLines = clampLines(wrapText(ctx, LOCKED_COPY.title, contentWidth), 2)
      const titleLineHeight = (titleSizes[state.size] + 12) * scale
      titleLines.forEach((line) => {
        ctx.fillText(line, padding, cursorY)
        cursorY += titleLineHeight
      })

      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.font = `500 ${Math.round(subtitleSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const subtitleLines = clampLines(wrapText(ctx, LOCKED_COPY.subtitle, contentWidth), 3)
      const subtitleLineHeight = (subtitleSizes[state.size] + 10) * scale
      cursorY += 6 * scale
      subtitleLines.forEach((line) => {
        ctx.fillText(line, padding, cursorY)
        cursorY += subtitleLineHeight
      })

      ctx.fillStyle = 'rgba(255,255,255,0.72)'
      ctx.font = `400 ${Math.round(descSizes[state.size] * scale)}px ui-sans-serif, system-ui`
      const descLines = clampLines(wrapText(ctx, LOCKED_COPY.description, contentWidth), 3)
      const descLineHeight = (descSizes[state.size] + 8) * scale
      cursorY += 6 * scale
      descLines.forEach((line) => {
        ctx.fillText(line, padding, cursorY)
        cursorY += descLineHeight
      })

      const sdgLabelY = exportHeight - padding - 110 * scale
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = `500 ${Math.round(18 * scale)}px ui-sans-serif, system-ui`
      ctx.fillText('Aligned with the UN SDGs', padding, sdgLabelY)

      const sdgContainerY = sdgLabelY + 30 * scale
      const sdgContainerHeight = 72 * scale
      const iconSize = (state.size === 'story' ? 46 : state.size === 'portrait' ? 42 : 40) * scale
      const gap = 12 * scale
      const totalIconsWidth = SDG_ICONS.length * iconSize + (SDG_ICONS.length - 1) * gap
      const sdgContainerWidth = totalIconsWidth + 32 * scale
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      drawRoundedRect(
        ctx,
        padding,
        sdgContainerY,
        sdgContainerWidth,
        sdgContainerHeight,
        18 * scale
      )
      ctx.fill()

      const pledgeName = state.name.trim().slice(0, 60)
      if (pledgeName) {
        const nameText = `Pledged by ${pledgeName}`
        const nameMaxWidth = contentWidth
        const baseNameSize = nameSizes[state.size] * scale
        const minNameSize = Math.max(36, baseNameSize - 16)
        const finalNameSize = fitText(ctx, nameText, nameMaxWidth, baseNameSize, minNameSize)

        const chipPaddingX = 26 * scale
        const chipPaddingY = 16 * scale
        ctx.font = `700 ${Math.round(finalNameSize)}px ui-sans-serif, system-ui`
        const textWidth = ctx.measureText(nameText).width
        const chipWidth = textWidth + chipPaddingX * 2
        const chipHeight = finalNameSize + chipPaddingY * 2

        const chipY = sdgLabelY - chipHeight - 18 * scale
        ctx.fillStyle = 'rgba(0, 208, 132, 0.9)'
        drawRoundedRect(ctx, padding, chipY, chipWidth, chipHeight, 999)
        ctx.fill()
        ctx.fillStyle = '#0b1510'
        ctx.textBaseline = 'middle'
        ctx.fillText(nameText, padding + chipPaddingX, chipY + chipHeight / 2)
      }

      let iconX = padding + (sdgContainerWidth - totalIconsWidth) / 2
      const iconY = sdgContainerY + (sdgContainerHeight - iconSize) / 2

      const iconImages = await Promise.all(
        SDG_ICONS.map(async (number) => {
          const img = new Image()
          img.src = `/sdgs/sdg-${number}.svg`
          await img.decode().catch(() => null)
          if (img.complete && img.naturalWidth > 0) return img
          return null
        })
      )

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
          ctx.textAlign = 'left'
        }
        iconX += iconSize + gap
      })

      // Admin note: place the official UN logo at /public/brand/un-logo.png if permitted.
      const unLogo = new Image()
      unLogo.src = '/brand/un-logo.png'
      await unLogo.decode().catch(() => null)
      if (unLogo.complete && unLogo.naturalWidth > 0) {
        const unSize = 44 * scale
        const unX = Math.min(
          padding + sdgContainerWidth + 16 * scale,
          exportWidth - padding - unSize
        )
        ctx.drawImage(unLogo, unX, sdgLabelY - 6 * scale, unSize, unSize)
      }

      const footerY = exportHeight - padding + 6 * scale
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.4 * scale
      ctx.fillStyle = BRAND_STYLE.accent
      drawLeaf(ctx, padding, footerY - 8 * scale, 16 * scale)
      ctx.font = `500 ${Math.round(18 * scale)}px ui-sans-serif, system-ui`
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.textBaseline = 'middle'
      ctx.fillText('oneteenonetree.org', padding + 22 * scale, footerY)
    }

    render()
  }, [state, photoUrl, canvasRef])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto rounded-3xl border border-white/10 bg-black/20"
      aria-label="Poster preview"
    />
  )
}
