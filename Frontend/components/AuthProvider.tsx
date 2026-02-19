"use client"

import { useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/stores/authStore'

export default function AuthProvider({ children }: PropsWithChildren) {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return <>{children}</>
}
