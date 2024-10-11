import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            BlackWom
          </Link>
          <div className="flex items-center">
            <Link href="/cart" className="text-gray-600 hover:text-gray-800 mr-4">
              Cart
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-800">
              Account
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}