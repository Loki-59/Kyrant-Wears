"use client"

import { useRouter } from 'next/navigation'
import { usePathname, useParams } from 'next/navigation'
import { useProductById } from '@/lib/hooks/useProducts'
import useCartStore from '@/stores/cartStore'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id
  const { data: product, isLoading, error } = useProductById(id)
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">Failed to load product.</div>
  if (!product) return <div className="p-8">Product not found.</div>

  const handleAdd = () => {
    addItem({ id: product.id, title: product.title, price: product.price ?? 0, quantity: 1 })
    toast.success('Added to cart')
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.images?.[0] ?? '/png/merged-asset-1@2x.png'} alt={product.title} className="w-full h-96 object-cover rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6">
            <div className="text-3xl font-extrabold">${(product.price ?? 0).toFixed(2)}</div>
            <button onClick={handleAdd} className="mt-4 px-6 py-3 rounded bg-[#06302B] text-white">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
