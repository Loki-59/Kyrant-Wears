'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'es' | 'fr' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.kyrant': 'Kyrant',
    'header.welcome': 'Welcome to Kyrant',
    'header.greeting': 'Hi Designers',
    
    // Form
    'form.email': 'Email',
    'form.password': 'Password',
    'form.confirmPassword': 'Confirm Password',
    'form.fullName': 'Full Name',
    'form.signup': 'Sign up',
    'form.login': 'Login',
    'form.signupWithGoogle': 'Sign up with Google',
    'form.loginWithGoogle': 'Login with Google',
    'form.or': 'or',
    'form.alreadyHaveAccount': 'Already have an account?',
    'form.dontHaveAccount': "Don't have an account?",
    'form.loginLink': 'Login',
    'form.signupLink': 'Sign up',
    
    // Roles
    'role.buyer': 'Buyer',
    'role.designer': 'Designer',
    'role.selectRole': 'Select your role',
    
    // Messages
    'message.signupSuccess': 'Account created successfully!',
    'message.loginSuccess': 'Login successful!',
    'message.loading': 'Loading...',
    'message.error': 'An error occurred',
    
    // Validation
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Please enter a valid email',
    'validation.passwordRequired': 'Password is required',
    'validation.passwordMin': 'Password must be at least 6 characters',
    'validation.passwordMatch': 'Passwords do not match',
    'validation.roleRequired': 'Please select a role',
  },
  es: {
    'header.kyrant': 'Kyrant',
    'header.welcome': 'Bienvenido a Kyrant',
    'header.greeting': 'Hola Diseñadores',
    'form.email': 'Correo electrónico',
    'form.password': 'Contraseña',
    'form.confirmPassword': 'Confirmar contraseña',
    'form.fullName': 'Nombre completo',
    'form.signup': 'Registrarse',
    'form.login': 'Iniciar sesión',
    'form.signupWithGoogle': 'Registrarse con Google',
    'form.loginWithGoogle': 'Iniciar sesión con Google',
    'form.or': 'o',
    'form.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'form.dontHaveAccount': '¿No tienes una cuenta?',
    'form.loginLink': 'Iniciar sesión',
    'form.signupLink': 'Registrarse',
    'role.buyer': 'Comprador',
    'role.designer': 'Diseñador',
    'role.selectRole': 'Selecciona tu rol',
    'message.signupSuccess': '¡Cuenta creada exitosamente!',
    'message.loginSuccess': '¡Inicio de sesión exitoso!',
    'message.loading': 'Cargando...',
    'message.error': 'Ocurrió un error',
    'validation.emailRequired': 'El correo electrónico es requerido',
    'validation.emailInvalid': 'Por favor ingresa un correo válido',
    'validation.passwordRequired': 'La contraseña es requerida',
    'validation.passwordMin': 'La contraseña debe tener al menos 6 caracteres',
    'validation.passwordMatch': 'Las contraseñas no coinciden',
    'validation.roleRequired': 'Por favor selecciona un rol',
  },
  fr: {
    'header.kyrant': 'Kyrant',
    'header.welcome': 'Bienvenue sur Kyrant',
    'header.greeting': 'Bonjour Designers',
    'form.email': 'E-mail',
    'form.password': 'Mot de passe',
    'form.confirmPassword': 'Confirmer le mot de passe',
    'form.fullName': 'Nom complet',
    'form.signup': "S'inscrire",
    'form.login': 'Se connecter',
    'form.signupWithGoogle': "S'inscrire avec Google",
    'form.loginWithGoogle': 'Se connecter avec Google',
    'form.or': 'ou',
    'form.alreadyHaveAccount': 'Vous avez déjà un compte?',
    'form.dontHaveAccount': "Vous n'avez pas de compte?",
    'form.loginLink': 'Se connecter',
    'form.signupLink': "S'inscrire",
    'role.buyer': 'Acheteur',
    'role.designer': 'Designer',
    'role.selectRole': 'Sélectionnez votre rôle',
    'message.signupSuccess': 'Compte créé avec succès!',
    'message.loginSuccess': 'Connexion réussie!',
    'message.loading': 'Chargement...',
    'message.error': 'Une erreur est survenue',
    'validation.emailRequired': "L'e-mail est requis",
    'validation.emailInvalid': "Veuillez entrer un e-mail valide",
    'validation.passwordRequired': 'Le mot de passe est requis',
    'validation.passwordMin': 'Le mot de passe doit contenir au moins 6 caractères',
    'validation.passwordMatch': 'Les mots de passe ne correspondent pas',
    'validation.roleRequired': 'Veuillez sélectionner un rôle',
  },
  de: {
    'header.kyrant': 'Kyrant',
    'header.welcome': 'Willkommen bei Kyrant',
    'header.greeting': 'Hallo Designer',
    'form.email': 'E-Mail',
    'form.password': 'Passwort',
    'form.confirmPassword': 'Passwort bestätigen',
    'form.fullName': 'Vollständiger Name',
    'form.signup': 'Registrieren',
    'form.login': 'Anmelden',
    'form.signupWithGoogle': 'Mit Google registrieren',
    'form.loginWithGoogle': 'Mit Google anmelden',
    'form.or': 'oder',
    'form.alreadyHaveAccount': 'Haben Sie bereits ein Konto?',
    'form.dontHaveAccount': 'Haben Sie kein Konto?',
    'form.loginLink': 'Anmelden',
    'form.signupLink': 'Registrieren',
    'role.buyer': 'Käufer',
    'role.designer': 'Designer',
    'role.selectRole': 'Wählen Sie Ihre Rolle',
    'message.signupSuccess': 'Konto erfolgreich erstellt!',
    'message.loginSuccess': 'Anmeldung erfolgreich!',
    'message.loading': 'Laden...',
    'message.error': 'Ein Fehler ist aufgetreten',
    'validation.emailRequired': 'E-Mail ist erforderlich',
    'validation.emailInvalid': 'Bitte geben Sie eine gültige E-Mail ein',
    'validation.passwordRequired': 'Passwort ist erforderlich',
    'validation.passwordMin': 'Passwort muss mindestens 6 Zeichen haben',
    'validation.passwordMatch': 'Passwörter stimmen nicht überein',
    'validation.roleRequired': 'Bitte wählen Sie eine Rolle',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kyrant-language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('kyrant-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Language options for the selector
export const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'ENG', flag: '🇺🇸' },
  { value: 'es', label: 'ESP', flag: '🇪🇸' },
  { value: 'fr', label: 'FRA', flag: '🇫🇷' },
  { value: 'de', label: 'DEU', flag: '🇩🇪' },
]
