"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useCartStore from '@/stores/cartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const schema = z.object({
  fullName: z.string().min(1),
  address: z.string().min(5),
  city: z.string().min(1),
  postalCode: z.string().min(2),
  country: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const cart = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clear = useCartStore((s) => s.clear)
  const router = useRouter()

  const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    // UI-only checkout: normally you'd create an order and call Stripe
    console.log('checkout', { data, cart })
    clear()
    toast.success('Order placed')
    router.push('/thank-you')
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('fullName')} placeholder="Full name" className="w-full px-4 py-3 border rounded" />
          <input {...register('address')} placeholder="Address" className="w-full px-4 py-3 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input {...register('city')} placeholder="City" className="px-4 py-3 border rounded" />
            <input {...register('postalCode')} placeholder="Postal code" className="px-4 py-3 border rounded" />
          </div>
          <input {...register('country')} placeholder="Country" className="w-full px-4 py-3 border rounded" />

          <div className="mt-4 p-4 border rounded">
            <div className="font-semibold">Order summary</div>
            <div className="mt-2">Items: {cart.length}</div>
            <div className="mt-1 font-bold">Total: ${total().toFixed(2)}</div>
          </div>

          <div className="mt-4">
            <div className="mb-2 font-semibold">Payment (UI only)</div>
            <div className="p-4 border rounded bg-gray-50">Stripe payment integration placeholder (add publishable key to env)</div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-3 rounded bg-[#06302B] text-white">Place order</button>
          </div>
        </form>
      </div>
    </div>
  )
}
