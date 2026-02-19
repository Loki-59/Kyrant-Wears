 'use client'

import dynamic from 'next/dynamic'
import ProtectedRoute from '@/components/ProtectedRoute'

const RouterApp = dynamic(() => import('@/components/merchant-router/RouterApp'), { ssr: false })

export default function MerchantDashboard() {
  return (
    <ProtectedRoute allowedRoles={["merchant"]}>
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#ECE4B7]">
        <div className="w-full p-5 max-w-7xl rounded-[20px] border-4 border-[#694873] overflow-hidden bg-[#694873]">
          <RouterApp />
        </div>
      </div>
    </ProtectedRoute>
  )
}
