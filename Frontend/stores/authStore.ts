import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

type Role = 'user' | 'merchant' | 'admin' | null

interface AuthState {
  user: User | null
  role: Role
  isLoading: boolean
  init: () => void
  setUser: (user: User | null, role?: Role) => void
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>
  signUpWithPassword: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: string }>
  signInWithOAuth: (provider: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  isLoading: false,

  init: async () => {
    set({ isLoading: true })

    try {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user ?? null
      let role = (user as any)?.user_metadata?.role ?? null
      // If role not in user_metadata, try to read from profiles table
      if (user && !role) {
        try {
          const { data: profileData, error: profileError } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
          if (!profileError && profileData?.role) {
            role = profileData.role
          } else {
            // If no profile exists, create one based on metadata or default to 'user'
            const fallbackRole = (user as any)?.user_metadata?.role ?? 'user'
            try {
              await supabase.from('profiles').upsert({ id: user.id, role: fallbackRole, full_name: (user as any)?.user_metadata?.full_name ?? null })
              role = fallbackRole
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          // ignore
        }
      }
      set({ user, role })

      // subscribe to auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user ?? null
        let r = (u as any)?.user_metadata?.role ?? null
        if (u && !r) {
          try {
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('role').eq('id', u.id).single()
            if (!profileError && profileData?.role) {
              r = profileData.role
            } else {
              // create profile fallback
              const fallbackRole = (u as any)?.user_metadata?.role ?? 'user'
              try {
                await supabase.from('profiles').upsert({ id: u.id, role: fallbackRole, full_name: (u as any)?.user_metadata?.full_name ?? null })
                r = fallbackRole
              } catch (e) {
                // ignore
              }
            }
          } catch (e) {
            // ignore
          }
        }
        set({ user: u, role: r })
        // subscribe to order updates for logged-in user
        if (u && r) {
          try {
            const channel = supabase.channel(`orders-user-${u.id}`)
            channel.on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${u.id}` },
              (payload) => {
                const ev = payload.eventType
                const newOrder = payload.new
                if (ev === 'UPDATE') {
                  toast.success(`Order ${newOrder?.id} updated: ${newOrder?.status ?? 'changed'}`)
                } else if (ev === 'INSERT') {
                  toast.success(`New order received: ${newOrder?.id}`)
                }
              }
            )
            await channel.subscribe()
          } catch (e) {
            // ignore
          }
        }
      })
    } catch (err) {
      // noop
    } finally {
      set({ isLoading: false })
    }
  },

  setUser: (user, role = null) => set({ user, role }),

  signInWithPassword: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      const user = data.user ?? null
      let role = (user as any)?.user_metadata?.role ?? null
      if (user && !role) {
        try {
          const { data: profileData, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          if (!profileError && profileData?.role) role = profileData.role
        } catch (e) {
          // ignore
        }
      }
      set({ user, role })
      return {}
    } catch (e: any) {
      return { error: e?.message ?? 'Unknown error' }
    } finally {
      set({ isLoading: false })
    }
  },

  signUpWithPassword: async (email, password, metadata) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } })
      if (error) return { error: error.message }
      const user = data.user ?? null
      let role = (user as any)?.user_metadata?.role ?? null
      if (user && !role) {
        try {
          const { data: profileData, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          if (!profileError && profileData?.role) {
            role = profileData.role
          } else {
            // ensure profile is created with provided metadata.role or user metadata or default
            const profileRole = metadata?.role ?? (user as any)?.user_metadata?.role ?? 'user'
            try {
              await supabase.from('profiles').upsert({ id: user.id, role: profileRole, full_name: metadata?.full_name ?? (user as any)?.user_metadata?.full_name ?? null })
              role = profileRole
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          // ignore
        }
      }
      set({ user, role })
      return {}
    } catch (e: any) {
      return { error: e?.message ?? 'Unknown error' }
    } finally {
      set({ isLoading: false })
    }
  },

  signInWithOAuth: async (provider) => {
    set({ isLoading: true })
    try {
      await supabase.auth.signInWithOAuth({ provider: provider as any, options: { redirectTo: `${window.location.origin}/auth/callback` } })
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    try {
      await supabase.auth.signOut()
      set({ user: null, role: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useAuthStore
