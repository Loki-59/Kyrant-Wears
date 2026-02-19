const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface SignupData {
  email: string
  password: string
  role: 'buyer' | 'designer' | 'admin'
  full_name?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export const api = {
  // Auth endpoints
  signup: async (data: SignupData): Promise<ApiResponse<{ user: any }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        return { error: result.error || 'Signup failed' }
      }
      
      return { data: result, message: result.message }
    } catch (error) {
      return { error: 'Network error. Please try again.' }
    }
  },

  // Get current user profile
  getMe: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        return { error: result.error || 'Failed to get user profile' }
      }
      
      return { data: result }
    } catch (error) {
      return { error: 'Network error. Please try again.' }
    }
  },

  // Products endpoints
  getProducts: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      const result = await response.json()
      
      if (!response.ok) {
        return { error: result.error || 'Failed to fetch products' }
      }
      
      return { data: result }
    } catch (error) {
      return { error: 'Network error. Please try again.' }
    }
  },

  // Orders endpoints
  getOrders: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        credentials: 'include',
      })
      const result = await response.json()
      
      if (!response.ok) {
        return { error: result.error || 'Failed to fetch orders' }
      }
      
      return { data: result }
    } catch (error) {
      return { error: 'Network error. Please try again.' }
    }
  },
}
