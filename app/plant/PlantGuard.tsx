'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader'

export default function PlantGuard({
  children,
  initiallyAuthed = false,
}: {
  children: React.ReactNode
  initiallyAuthed?: boolean
}) {
  const { replace } = useNavigateWithLoader()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [checking, setChecking] = useState(!initiallyAuthed)

  useEffect(() => {
    let active = true
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        if (!data.session) {
          replace('/pledge')
          return
        }
        setChecking(false)
      })
      .catch(() => {
        if (!active) return
        replace('/pledge')
      })
    return () => {
      active = false
    }
  }, [router, supabase])

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-6 md:p-8 animate-pulse space-y-4">
          <div className="h-6 w-40 rounded-full bg-white/10" />
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-4/5 rounded-full bg-white/10" />
          <div className="h-10 w-32 rounded-xl bg-white/10" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
