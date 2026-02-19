'use client'

export default function Home() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Merchant Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 border-2 border-[#694873] rounded-lg">Total Sales<br/><span className="text-2xl font-bold">$0.00</span></div>
        <div className="p-6 bg-white/5 border-2 border-[#694873] rounded-lg">Orders<br/><span className="text-2xl font-bold">0</span></div>
        <div className="p-6 bg-white/5 border-2 border-[#694873] rounded-lg">Products<br/><span className="text-2xl font-bold">0</span></div>
      </div>
      <div className="mt-6 p-6 bg-white/5 border-2 border-[#694873] rounded-lg">Recent activity placeholder</div>
    </div>
  )
}
