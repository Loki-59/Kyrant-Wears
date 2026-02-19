"use client"

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Design } from '@/types/design'

export const fetchProducts = async (page = 1, perPage = 12): Promise<Design[]> => {
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error } = await supabase
    .from<Design>('designs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return data || []
}

export const useProducts = (page = 1, perPage = 12) => {
  return useQuery(['products', page, perPage], () => fetchProducts(page, perPage), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  })
}

export const useProductById = (id: string | undefined) => {
  return useQuery(['product', id], async () => {
    if (!id) return null
    const { data, error } = await supabase.from<Design>('designs').select('*').eq('id', id).single()
    if (error) throw error
    return data as Design
  }, { enabled: !!id })
}
