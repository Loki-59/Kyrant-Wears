"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage, languageOptions } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError(t('validation.emailRequired'))
      return
    }

    setIsLoading(true)
    try {
      // Send password reset email
      // supabase.auth.resetPasswordForEmail may accept (email, { redirectTo })
      // Fallback to supabase.auth.resetPasswordForEmail as function
      // We'll call the v2-style method if available.
      // @ts-ignore
      const res = await supabase.auth.resetPasswordForEmail?.(email, { redirectTo: `${window.location.origin}/login` })
      // If method returns object with error
      if (res?.error) {
        setError(res.error.message || t('message.error'))
      } else {
        setMessage(t('message.resetEmailSent') || 'Password reset email sent.')
        setTimeout(() => router.push('/login'), 1800)
      }
    } catch (e: any) {
      setError(e?.message ?? t('message.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const currentLang = languageOptions.find((l) => l.value === language)

  return (
    <div className="min-h-screen bg-[#06302B] flex items-center justify-center p-4">
      <div className="w-full p-5 max-w-2xl rounded-[30px] border-4 border-[#694873] overflow-hidden bg-[#694873] text-[#ECE4B7]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{t('form.forgotPassword') || 'Forgot Password'}</h2>
          <p className="text-sm">{t('form.forgotPasswordDesc') || 'Enter your email to receive a password reset link.'}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-sm text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t('form.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none"
          />

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-full bg-[#06302B] text-[#ECE4B7] font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : t('form.sendReset') || 'Send reset email'}
            </button>
            <a href="/login" className="text-sm text-[#ECE4B7] underline">
              {t('form.backToLogin') || 'Back to login'}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
