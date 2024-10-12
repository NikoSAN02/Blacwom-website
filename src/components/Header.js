"use client"
import Link from 'next/link'
import { useCart } from '../app/context/CartContext'


export default function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Beauty Bliss
          </Link>
          <div className="flex items-center">
            <Link href="/cart" className="text-gray-600 hover:text-gray-800 mr-4">
              Cart ({itemCount})
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}