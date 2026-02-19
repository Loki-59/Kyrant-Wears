"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useLanguage, languageOptions } from '@/context/LanguageContext'
import useAuthStore from '@/stores/authStore'

export default function SignupPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'user' | 'merchant' | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const validateForm = (): boolean => {
    setError('')
    if (!email) { setError(t('validation.emailRequired')); return false }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError(t('validation.emailInvalid')); return false }
    if (!password) { setError(t('validation.passwordRequired')); return false }
    if (password.length < 6) { setError(t('validation.passwordMin')); return false }
    if (password !== confirmPassword) { setError(t('validation.passwordMatch')); return false }
    if (!role) { setError(t('validation.roleRequired')); return false }
    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const { error: err } = await useAuthStore.getState().signUpWithPassword(email, password, { full_name: fullName, role })
      if (err) { setError(err); setIsLoading(false); return }
      setSuccess(t('message.signupSuccess'))
      const roleState = useAuthStore.getState().role
      const to = roleState === 'merchant' ? '/merchant-dashboard' : roleState === 'admin' ? '/admin' : '/'
      setTimeout(() => router.push(to), 800)
    } catch (e) {
      setError(t('message.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const currentLang = languageOptions.find(l => l.value === language)

  return (
    <div className="min-h-screen bg-[#06302B] flex items-center justify-center p-4">
      <div className="w-full p-5 max-w-7xl rounded-[40px] border-4 border-[#694873] overflow-hidden flex flex-col lg:flex-row bg-[#694873]">
        <div className="w-full lg:w-5/7.2 relative overflow-hidden">
          <div className="rounded-[40px] p-[4px]" style={{ background: '#694873' }}>
            <div style={{ borderTopLeftRadius: 40, borderBottomLeftRadius: 40, overflow: 'hidden', clipPath: 'polygon(7.7% 0%, 90.4% 0%, 79.1% 100%, 2.2% 100%)' }}>
              <img src="/png/merged-asset-1@2x.png" alt="The Boston Product" className="w-full h-full object-cover" style={{ display: 'block' }} />
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
            <button className="w-10 h-10 rounded-full border-2 border-[#06302B] bg-[#06302B]/30 flex items-center justify-center hover:bg-[#06302B]/50 transition">
              <ChevronLeft size={20} className="text-[#06302B]" />
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-[#06302B] bg-[#06302B]/30 flex items-center justify-center hover:bg-[#06302B]/50 transition">
              <ChevronRight size={20} className="text-[#06302B]" />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-5/7.2 bg-[#694873] p-8 md:p-12 flex flex-col justify-between text-[#ECE4B7]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-3xl font-[500] italic font-serif">{t('header.kyrant')}</h1>
              <div className="relative">
                <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className="px-6 py-2 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] text-sm font-medium hover:bg-[#ECE4B7] hover:text-black transition flex items-center gap-2">
                  <span className="bg-black h-3 w-3 block"></span>
                  {currentLang?.label || 'ENG'}
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#694873] border-4 border-[#ECE4B7] rounded-full overflow-hidden z-50">
                    {languageOptions.map((lang) => (
                      <button key={lang.value} onClick={() => { setLanguage(lang.value); setShowLanguageMenu(false) }} className={`w-full px-4 py-2 text-left text-sm hover:bg-[#ECE4B7] hover:text-black transition flex items-center gap-2 ${language === lang.value ? 'bg-[#ECE4B7] text-black' : 'text-[#ECE4B7]'}`}>
                        <span>{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('header.greeting')}</h2>
              <p className="text-sm md:text-base font-light">{t('header.welcome')}</p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-center">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-sm text-center">{success}</div>}

            <form onSubmit={handleSignup} className="space-y-6 w-full max-w-md mx-auto">
              <div className="flex gap-4 justify-center">
                <button type="button" onClick={() => setRole('user')} className={`flex-1 px-6 py-3 rounded-full border-4 transition ${role === 'user' ? 'border-[#ECE4B7] bg-[#ECE4B7] text-black' : 'border-[#ECE4B7] bg-transparent text-[#ECE4B7]'}`}>Buyer</button>
                <button type="button" onClick={() => setRole('merchant')} className={`flex-1 px-6 py-3 rounded-full border-4 transition ${role === 'merchant' ? 'border-[#ECE4B7] bg-[#ECE4B7] text-black' : 'border-[#ECE4B7] bg-transparent text-[#ECE4B7]'}`}>Merchant</button>
              </div>

              <div>
                <input type="text" placeholder={t('form.fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition" />
              </div>

              <div>
                <input type="email" placeholder={t('form.email')} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition" />
              </div>

              <div>
                <input type="password" placeholder={t('form.password')} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition" />
              </div>

              <div>
                <input type="password" placeholder={t('form.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition" />
              </div>

              <div className="space-y-6 w-full max-w-md mx-auto">
                <button type="submit" disabled={isLoading} className="w-full px-6 py-4 rounded-full bg-[#06302B] text-[#ECE4B7] font-bold text-lg hover:bg-[#06302B]/80 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (<><Loader2 size={20} className="animate-spin" />{t('message.loading')}</>) : (t('form.signup'))}
                </button>

                <p className="text-center text-sm">Already have an account? <a href="/login" className="text-[#ECE4B7] font-semibold hover:underline">{t('form.loginLink')}</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
