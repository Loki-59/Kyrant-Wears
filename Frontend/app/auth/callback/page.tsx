'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          setStatus('Authentication failed. Redirecting to login...')
          setTimeout(() => router.push('/login?error=auth_failed'), 2000)
          return
        }

        if (data.session) {
          setStatus('Authentication successful! Redirecting...')
          setTimeout(() => router.push('/dashboard'), 1000)
        } else {
          // No session, try to exchange code for session
          const { error: exchangeError } = await supabase.auth.getUser()
          
          if (exchangeError) {
            console.error('Session exchange error:', exchangeError)
            setStatus('Authentication failed. Redirecting to login...')
            setTimeout(() => router.push('/login?error=auth_failed'), 2000)
          } else {
            setStatus('Authentication successful! Redirecting...')
            setTimeout(() => router.push('/dashboard'), 1000)
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setStatus('An unexpected error occurred. Redirecting to login...')
        setTimeout(() => router.push('/login?error=unexpected_error'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#06302B] flex items-center justify-center">
      <div className="text-center text-[#ECE4B7]">
        <div className="w-16 h-16 border-4 border-[#ECE4B7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-semibold">{status}</p>
      </div>
    </div>
  )
}
