"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren, ReactNode } from 'react'
import useAuthStore from '@/stores/authStore'

type Role = 'user' | 'merchant' | 'admin' | null

interface ProtectedProps {
  children: ReactNode
  allowedRoles?: Role[]
  redirectTo?: string
}

export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }: PropsWithChildren<ProtectedProps>) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace(redirectTo)
      return
    }

    if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      router.replace('/')
    }
  }, [user, role, isLoading, allowedRoles, redirectTo, router])

  if (isLoading || !user) return null

  return <>{children}</>
}
