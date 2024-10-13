'use client'

import Link from 'next/link'
import { useCart } from '../app/context/CartContext'
import { useAuth } from '../app/context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../app/lib/firebase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            BlackWom
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-800">
              Cart ({itemCount})
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-800">
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-800">
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}