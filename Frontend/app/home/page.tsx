import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ECE4B7] flex flex-col">
      <header className="w-full bg-[#06302B] text-[#ECE4B7] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Kyrant</h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Signup</Link>
            <Link href="/login" className="hover:underline">User Login</Link>
            <Link href="/merchant-login" className="hover:underline">Merchant Login</Link>
            <Link href="/merchant-dashboard" className="hover:underline">Merchant Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Kyrant</h2>
          <p className="mb-6">Choose an action from the navbar to sign up or log in.</p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="px-6 py-3 rounded-full bg-[#06302B] text-[#ECE4B7]">User Login</Link>
            <Link href="/merchant-login" className="px-6 py-3 rounded-full border-2 border-[#06302B]">Merchant Login</Link>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-gray-600">© Kyrant</footer>
    </div>
  )
}
