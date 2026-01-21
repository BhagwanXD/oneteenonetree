'use client'

import { useEffect } from 'react'
import { SIZE_OPTIONS, TEMPLATE_STYLES, TEMPLATE_OPTIONS } from '../constants'
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
  height: number
) => {
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const dx = (width - drawWidth) / 2
  const dy = (height - drawHeight) / 2
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

export default function PosterCanvas({ state, photoUrl, canvasRef }: PosterCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = getSize(state.size)
    const scale = width / 1080
    const padding = 72 * scale

    canvas.width = width
    canvas.height = height

    const style = TEMPLATE_STYLES[state.template]
    const templateLabel =
      TEMPLATE_OPTIONS.find((option) => option.value === state.template)?.label ?? 'Impact Card'
    const isStoryTemplate = state.template === 'onetree'

    const render = async () => {
      ctx.clearRect(0, 0, width, height)

      if (isStoryTemplate && photoUrl) {
        const photo = new Image()
        photo.src = photoUrl
        await photo.decode().catch(() => null)
        if (photo.complete && photo.naturalWidth > 0) {
          drawCover(ctx, photo, width, height)
        }
      } else if (state.background === 'photo' && photoUrl) {
        const photo = new Image()
        photo.src = photoUrl
        await photo.decode().catch(() => null)
        if (photo.complete && photo.naturalWidth > 0) {
          drawCover(ctx, photo, width, height)
        }
      }

      if ((state.background !== 'photo' || !photoUrl) && !isStoryTemplate) {
        if (state.background === 'solid') {
          ctx.fillStyle = '#0f1f17'
          ctx.fillRect(0, 0, width, height)
        } else {
          const gradient = ctx.createLinearGradient(0, 0, width, height)
          gradient.addColorStop(0, style.gradient[0])
          gradient.addColorStop(1, style.gradient[1])
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)
        }
      } else if (isStoryTemplate && !photoUrl) {
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, style.gradient[0])
        gradient.addColorStop(1, style.gradient[1])
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      const overlay = ctx.createLinearGradient(0, 0, 0, height)
      overlay.addColorStop(0, isStoryTemplate ? 'rgba(6, 20, 12, 0.4)' : 'rgba(5, 12, 8, 0.28)')
      overlay.addColorStop(1, isStoryTemplate ? 'rgba(5, 12, 8, 0.85)' : 'rgba(5, 12, 8, 0.78)')
      ctx.fillStyle = overlay
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.globalAlpha = 0.8
      ctx.fillStyle = style.glow
      ctx.beginPath()
      ctx.arc(width * 0.85, height * 0.12, width * 0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const logo = new Image()
      logo.src = '/logo.png'
      await logo.decode().catch(() => null)
      const logoSize = 56 * scale
      const logoBox = 70 * scale
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      drawRoundedRect(ctx, padding, padding, logoBox, logoBox, 18 * scale)
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

      if (isStoryTemplate) {
        const titleText = 'OneTeenOneTree = One Tree'
        const subtitleText = 'Take the pledge. Plant a tree. Inspire your friends.'
        const descriptionText =
          'Share this to your story and tag OneTeenOneTree to grow the movement.'

        const contentPadding = 88 * scale
        let cursorY = padding + logoBox + 48 * scale
        const contentWidth = width - padding * 2

        ctx.textBaseline = 'top'
        ctx.fillStyle = '#ffffff'
        ctx.font = `${Math.round(72 * scale)}px ui-sans-serif, system-ui`
        const titleLines = clampLines(wrapText(ctx, titleText, contentWidth), 2)
        const titleLineHeight = 80 * scale
        titleLines.forEach((line) => {
          ctx.fillText(line, padding, cursorY)
          cursorY += titleLineHeight
        })

        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.font = `${Math.round(30 * scale)}px ui-sans-serif, system-ui`
        const subtitleLines = clampLines(wrapText(ctx, subtitleText, contentWidth), 3)
        const subtitleLineHeight = 38 * scale
        cursorY += 16 * scale
        subtitleLines.forEach((line) => {
          ctx.fillText(line, padding, cursorY)
          cursorY += subtitleLineHeight
        })

        ctx.fillStyle = 'rgba(255,255,255,0.72)'
        ctx.font = `${Math.round(22 * scale)}px ui-sans-serif, system-ui`
        const descLines = clampLines(wrapText(ctx, descriptionText, contentWidth), 3)
        const descLineHeight = 30 * scale
        cursorY += 12 * scale
        descLines.forEach((line) => {
          ctx.fillText(line, padding, cursorY)
          cursorY += descLineHeight
        })

        const pledgeName = state.pledgeName.trim().slice(0, 40)
        if (pledgeName) {
          ctx.font = `${Math.round(20 * scale)}px ui-sans-serif, system-ui`
          ctx.textBaseline = 'middle'
          const chipText = `Pledged by: ${pledgeName}`
          const chipWidth = ctx.measureText(chipText).width + 32 * scale
          const chipHeight = 40 * scale
          const chipY = cursorY + 20 * scale
          ctx.fillStyle = 'rgba(255,255,255,0.12)'
          drawRoundedRect(ctx, padding, chipY, chipWidth, chipHeight, 999)
          ctx.fill()
          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.fillText(chipText, padding + 16 * scale, chipY + chipHeight / 2)
        }

        const sdgLabelY = height - contentPadding - 148 * scale
        ctx.textBaseline = 'top'
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.font = `${Math.round(18 * scale)}px ui-sans-serif, system-ui`
        ctx.fillText('Aligned with the UN SDGs', padding, sdgLabelY)

        const sdgContainerY = sdgLabelY + 30 * scale
        const sdgContainerHeight = 72 * scale
        const sdgContainerWidth = width - padding * 2
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        drawRoundedRect(ctx, padding, sdgContainerY, sdgContainerWidth, sdgContainerHeight, 18 * scale)
        ctx.fill()

        const sdgIcons = ['6', '7', '11', '12', '13', '15', '17']
        const iconSize = 36 * scale
        const gap = 12 * scale
        const totalIconsWidth = sdgIcons.length * iconSize + (sdgIcons.length - 1) * gap
        let iconX = padding + (sdgContainerWidth - totalIconsWidth) / 2
        const iconY = sdgContainerY + (sdgContainerHeight - iconSize) / 2

        const iconImages = await Promise.all(
          sdgIcons.map(async (number) => {
            const img = new Image()
            img.src = `/sdgs/sdg-${number}.svg`
            await img.decode().catch(() => null)
            if (img.complete && img.naturalWidth > 0) return img
            return null
          })
        )

        iconImages.forEach((img) => {
          if (img) {
            ctx.drawImage(img, iconX, iconY, iconSize, iconSize)
          }
          iconX += iconSize + gap
        })

        // Admin note: place official UN logo at /public/brand/un-logo.png if permitted.
        const unLogo = new Image()
        unLogo.src = '/brand/un-logo.png'
        await unLogo.decode().catch(() => null)
        if (unLogo.complete && unLogo.naturalWidth > 0) {
          const unSize = 40 * scale
          ctx.drawImage(unLogo, width - padding - unSize, sdgContainerY - 4 * scale, unSize, unSize)
        }

        const footerY = height - contentPadding + 6 * scale
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.lineWidth = 1.4 * scale
        ctx.fillStyle = style.accent
        drawLeaf(ctx, padding, footerY - 8 * scale, 16 * scale)
        ctx.font = `${Math.round(18 * scale)}px ui-sans-serif, system-ui`
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.textBaseline = 'middle'
        ctx.fillText('oneteenonetree.org', padding + 22 * scale, footerY)
        return
      }

      ctx.font = `${12 * scale}px ui-sans-serif, system-ui`
      ctx.textBaseline = 'middle'
      const badgePaddingX = 14 * scale
      const badgePaddingY = 8 * scale
      const badgeText = templateLabel
      const badgeWidth = ctx.measureText(badgeText).width + badgePaddingX * 2
      const badgeHeight = 28 * scale
      const badgeX = width - padding - badgeWidth
      const badgeY = padding + (logoBox - badgeHeight) / 2
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 999)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillText(badgeText, badgeX + badgePaddingX, badgeY + badgeHeight / 2)

      let formattedDate: string | null = null
      if (state.date) {
        const parsed = new Date(state.date)
        if (!Number.isNaN(parsed.getTime())) {
          formattedDate = parsed.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        }
      }

      const metaTags = [
        state.city ? state.city.trim() : null,
        formattedDate,
      ].filter(Boolean) as string[]

      let metaY = padding + logoBox + 28 * scale
      let metaX = padding
      ctx.font = `${12 * scale}px ui-sans-serif, system-ui`
      ctx.textBaseline = 'middle'
      metaTags.forEach((tag) => {
        const tagWidth = ctx.measureText(tag).width + 22 * scale
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        drawRoundedRect(ctx, metaX, metaY, tagWidth, 26 * scale, 999)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillText(tag, metaX + 11 * scale, metaY + 13 * scale)
        metaX += tagWidth + 10 * scale
      })

      const contentStart = metaTags.length ? metaY + 40 * scale : metaY
      const contentWidth = width - padding * 2
      let cursorY = contentStart

      ctx.textBaseline = 'top'
      ctx.fillStyle = '#ffffff'
      ctx.font = `${Math.round(64 * scale)}px ui-sans-serif, system-ui`
      const titleLines = clampLines(wrapText(ctx, state.title || 'OneTeenOneTree Poster', contentWidth), state.size === 'story' ? 4 : 3)
      const titleLineHeight = 72 * scale
      titleLines.forEach((line) => {
        ctx.fillText(line, padding, cursorY)
        cursorY += titleLineHeight
      })

      if (state.subtitle) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.font = `${Math.round(28 * scale)}px ui-sans-serif, system-ui`
        const subtitleLines = clampLines(wrapText(ctx, state.subtitle, contentWidth), 2)
        const subtitleLineHeight = 34 * scale
        cursorY += 12 * scale
        subtitleLines.forEach((line) => {
          ctx.fillText(line, padding, cursorY)
          cursorY += subtitleLineHeight
        })
      }

      if (state.description) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `${Math.round(20 * scale)}px ui-sans-serif, system-ui`
        const descLines = clampLines(wrapText(ctx, state.description, contentWidth), state.size === 'story' ? 4 : 3)
        const descLineHeight = 28 * scale
        cursorY += 14 * scale
        descLines.forEach((line) => {
          ctx.fillText(line, padding, cursorY)
          cursorY += descLineHeight
        })
      }

      const footerY = height - padding - 28 * scale
      const ctaHeight = 52 * scale
      if (state.ctaText) {
        const ctaText = state.ctaText.trim().slice(0, 40)
        ctx.font = `${Math.round(18 * scale)}px ui-sans-serif, system-ui`
        const ctaWidth = ctx.measureText(ctaText).width + 48 * scale
        const ctaX = padding
        const ctaY = footerY - ctaHeight - 16 * scale
        ctx.fillStyle = style.accent
        drawRoundedRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, 999)
        ctx.fill()
        ctx.fillStyle = '#0b1510'
        ctx.textBaseline = 'middle'
        ctx.fillText(ctaText, ctaX + 24 * scale, ctaY + ctaHeight / 2)
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.4 * scale
      ctx.fillStyle = style.accent
      drawLeaf(ctx, padding, footerY - 8 * scale, 16 * scale)
      ctx.font = `${Math.round(16 * scale)}px ui-sans-serif, system-ui`
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
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
