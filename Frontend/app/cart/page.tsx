"use client"

import useCartStore from '@/stores/cartStore'
import Link from 'next/link'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const total = useCartStore((s) => s.total)

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p>Your cart is empty.</p>
            <Link href="/products"><a className="mt-4 inline-block text-[#06302B]">Browse products</a></Link>
          </div>
        ) : (
          <div className="bg-gray-50 rounded p-4">
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-sm text-gray-600">${it.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} className="px-2 bg-gray-200 rounded">-</button>
                    <div className="px-3">{it.quantity}</div>
                    <button onClick={() => updateQuantity(it.id, it.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
                    <button onClick={() => removeItem(it.id)} className="ml-4 text-red-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-2xl font-extrabold">${total().toFixed(2)}</div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link href="/checkout"><a className="px-6 py-3 rounded bg-[#06302B] text-white">Proceed to checkout</a></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
