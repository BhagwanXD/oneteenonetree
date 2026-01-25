"use client"

import { useRouter } from 'next/navigation'

export default function useNavigateWithLoader() {
  const router = useRouter()

  const push = (href: string) => {
    router.push(href)
  }

  const replace = (href: string) => {
    router.replace(href)
  }

  return { push, replace }
}
