'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../app/context/CartContext'
import { useAuth } from '../app/context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../app/lib/firebase'
import { useRouter } from 'next/navigation'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import PasswordResetModal from './PasswordResetModal'

export default function Header() {
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getShortenedEmail = (email) => {
    if (!email) return '';
    const [username] = email.split('@');
    return username.length > 10 ? `${username.slice(0, 10)}...` : username;
  };

  const handleForgotPassword = () => {
    setIsSignInModalOpen(false);
    setIsPasswordResetModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-md py-4">
        <nav className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-gray-700">
              Blacwom
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                Home
              </Link>
              <Link href="/deals" className="text-gray-600 hover:text-gray-800">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-gray-600 hover:text-gray-800">
                New Arrivals
              </Link>
              <Link href="/packages" className="text-gray-600 hover:text-gray-800">
                Packages
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-800">
                Cart ({itemCount})
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-800">
                    {getShortenedEmail(user.email)}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onForgotPassword={handleForgotPassword}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
      />
    </>
  )
}