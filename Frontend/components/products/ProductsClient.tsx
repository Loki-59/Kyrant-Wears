"use client"

import { useState } from 'react'
import { useProducts } from '@/lib/hooks/useProducts'
import ProductCard from '@/components/product/ProductCard'
import Skeleton from '@/components/ui/skeleton'

export default function ProductsClient() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, isFetching } = useProducts(page, 12)

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Products</h1>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-red-600">Failed to load products.</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((d) => (
            <ProductCard key={d.id} item={d} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-[#06302B] text-white disabled:opacity-50"
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-[#06302B] text-white"
            disabled={isFetching}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
