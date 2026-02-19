"use client"

import Link from 'next/link'
import type { Design } from '@/types/design'

export default function ProductCard({ item }: { item: Design }) {
  const img = item.images?.[0] ?? '/png/merged-asset-1@2x.png'

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Link href={`/product/${item.id}`}>
        <a className="block h-48 w-full overflow-hidden">
          <img src={img} alt={item.title} className="w-full h-full object-cover" />
        </a>
      </Link>
      <div className="p-3">
        <h3 className="text-sm font-semibold">{item.title}</h3>
        <p className="text-xs text-muted-foreground">{item.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">${(item.price ?? 0).toFixed(2)}</span>
          <Link href={`/product/${item.id}`}>
            <a className="text-sm text-[#06302B] font-medium">View</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
