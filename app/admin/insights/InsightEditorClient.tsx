'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type { default as InsightEditor } from './InsightEditor'

const Editor = dynamic(() => import('./InsightEditor'), { ssr: false })

type InsightEditorProps = ComponentProps<typeof InsightEditor>

export default function InsightEditorClient(props: InsightEditorProps) {
  return <Editor {...props} />
}
