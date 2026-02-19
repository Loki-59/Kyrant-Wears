'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage, languageOptions } from '@/context/LanguageContext'
import useAuthStore from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  
  // Validation
  const validateForm = (): boolean => {
    setError('')
    
    if (!email) {
      setError(t('validation.emailRequired'))
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('validation.emailInvalid'))
      return false
    }
    
    if (!password) {
      setError(t('validation.passwordRequired'))
      return false
    }
    
    if (password.length < 6) {
      setError(t('validation.passwordMin'))
      return false
    }
    
    return true
  }
  
  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const { error } = await useAuthStore.getState().signInWithPassword(email, password)
      if (error) {
        setError(error)
        setIsLoading(false)
        return
      }

      setSuccess(t('message.loginSuccess'))

      // Redirect based on role
      const role = useAuthStore.getState().role
      const to = role === 'merchant' ? '/merchant-dashboard' : role === 'admin' ? '/admin' : '/'
      setTimeout(() => router.push(to), 800)
      
    } catch (err) {
      setError(t('message.error'))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await useAuthStore.getState().signInWithOAuth('google')
    } catch (err) {
      setError(t('message.error'))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get current language flag
  const currentLang = languageOptions.find(l => l.value === language)

  return (
    <div className="min-h-screen bg-[#06302B] flex items-center justify-center p-4">
      {/* Main Card Container */}
      <div className="w-full p-5 max-w-7xl rounded-[90px] border-4 border-[#694873] overflow-hidden flex flex-col lg:flex-row bg-[#694873]">
        
        {/* Left Panel - Image */}
        <div className="w-full lg:w-5/7.2 relative overflow-hidden">
          {/* <div
            className="rounded-[90px] p-3"
            style={{ background: '#16302B', clipPath: 'polygon(7.7% 0%, 90.4% 0%, 79.1% 100%, 2.2% 100%)' }}
          > */}
            <div
            className="rounded-[90px] p-3"
            style={{ background: '#16302B', clipPath: 'polygon(7.7% 0%, 90.4% 0%, 79.1% 100%, 2.2% 100%)' }}
          >
            <img
              src="/png/Men's Casual Slogan Print Loose Round Neck Short Sleeve T-Shirt.jpeg"
              alt="The Boston Product"
              className="w-full h-full object-cover rounded-[90px]"
            //   style={{ clipPath: 'polygon(7.7% 0%, 90.4% 0%, 79.1% 100%, 2.2% 100%)' }}
               style={{ clipPath: 'polygon(7.7% 0%, 90.4% 0%, 79.1% 100%, 2.2% 100%)' }}
            />
          </div>
          
          {/* Carousel Controls - green clickers */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
            <button className="w-10 h-10 rounded-full border-2 border-[#06302B] bg-[#06302B]/30 flex items-center justify-center hover:bg-[#06302B]/50 transition">
              <ChevronLeft size={20} className="text-[#06302B]" />
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-[#06302B] bg-[#06302B]/30 flex items-center justify-center hover:bg-[#06302B]/50 transition">
              <ChevronRight size={20} className="text-[#06302B]" />
            </button>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-5/7.2 bg-[#694873] p-8 md:p-12 flex flex-col justify-between text-[#ECE4B7]">
          
          {/* Header */}
          <div>
            {/* Top Navigation */}
            <div className="flex justify-between items-start mb-4">
              {/* Logo */}
              <h1 className="text-3xl md:text-3xl font-[500] italic font-serif">{t('header.kyrant')}</h1>
              
              {/* Language Selector - functional */}
              <div className="relative">
                <button 
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="px-6 py-2 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] text-sm font-medium hover:bg-[#ECE4B7] hover:text-black transition flex items-center gap-2"
                >
                  <span className="bg-black h-3 w-3 block"></span>
                  {currentLang?.label || 'ENG'}
                </button>
                
                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#694873] border-4 border-[#ECE4B7] rounded-full overflow-hidden z-50">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setLanguage(lang.value)
                          setShowLanguageMenu(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#ECE4B7] hover:text-black transition flex items-center gap-2 ${
                          language === lang.value ? 'bg-[#ECE4B7] text-black' : 'text-[#ECE4B7]'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Greeting - centered below header row */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('header.greeting')}</h2>
              <p className="text-sm md:text-base font-light">{t('header.welcome')}</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-sm text-center">
                {success}
              </div>
            )}

            {/* Form Fields - centered with moderate spacing */}
            <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md mx-auto">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder={t('form.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder={t('form.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-full border-4 border-[#ECE4B7] bg-[#694873] text-[#ECE4B7] placeholder-[#ECE4B7]/60 focus:outline-none focus:ring-2 focus:ring-[#ECE4B7] focus:ring-offset-0 transition"
                />
              </div>

              {/* Divider - with moderate spacing */}
              <div className="flex items-center gap-4 my-6 w-full max-w-md mx-auto">
                <div className="flex-1 h-1 bg-[#ECE4B7]"></div>
                <span className="text-sm text-[#ECE4B7]">{t('form.or')}</span>
                <div className="flex-1 h-1 bg-[#ECE4B7]"></div>
              </div>

              {/* Google Login Button */}
              <div className="w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-full border-4 border-[#ECE4B7] bg-transparent text-[#ECE4B7] font-medium flex items-center justify-center gap-3 hover:bg-[#ECE4B7]/10 transition disabled:opacity-50"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="18" fontSize="16" fill="#ECE4B7" fontWeight="bold">G</text>
                  </svg>
                  {t('form.loginWithGoogle')}
                </button>
              </div>

              {/* Login Button - centered */}
              <div className="space-y-6 w-full max-w-md mx-auto">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 rounded-full bg-[#06302B] text-[#ECE4B7] font-bold text-lg hover:bg-[#06302B]/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('message.loading')}
                    </>
                  ) : (
                    t('form.login')
                  )}
                </button>

                {/* Signup Link */}
                <p className="text-center text-sm">
                  {t('form.dontHaveAccount')}{' '}
                  <a href="/signup" className="text-[#ECE4B7] font-semibold hover:underline">
                    {t('form.signupLink')}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
