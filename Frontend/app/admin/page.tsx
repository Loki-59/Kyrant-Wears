"use client"

import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded">Pending designs (placeholder)</div>
            <div className="p-4 border rounded">User management (placeholder)</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
