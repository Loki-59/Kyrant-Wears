'use client'

import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="w-full bg-[#06302B] text-[#ECE4B7] p-4 rounded-t-2xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold">Kyrant</Link>
        <Link to="/" className="text-sm opacity-90 hover:underline">Home</Link>
        <Link to="/orders" className="text-sm opacity-90 hover:underline">Orders</Link>
        <Link to="/products" className="text-sm opacity-90 hover:underline">Products</Link>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded-full bg-[#694873] hover:bg-[#694873]/90">Profile</button>
      </div>
    </nav>
  )
}
