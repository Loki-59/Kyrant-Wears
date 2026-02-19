'use client'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './Home'
import Orders from './Orders'
import Products from './Products'

export default function RouterApp() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl w-full mx-auto">
        <Navbar />
        <div className="bg-[#694873] text-[#ECE4B7] rounded-b-2xl p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="col-span-1 hidden lg:block">
            <div className="h-full rounded-lg overflow-hidden border-2 border-[#ECE4B7]">
              <img src="/png/screen-printing-vs-heat-press.jpeg" alt="Screen vs Heat" className="w-full h-full object-cover" />
            </div>
          </aside>
          <main className="col-span-1 lg:col-span-3 rounded-lg p-4 bg-transparent">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
