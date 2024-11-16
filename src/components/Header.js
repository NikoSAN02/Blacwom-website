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

const ADMIN_EMAILS = ['blacwom01@gmail.com'];

export default function Header() {
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
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

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
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
              {user && (
                <Link href="/orders" className="text-gray-600 hover:text-gray-800">
                  My Orders
                </Link>
              )}
              <Link href="/cart" className="text-gray-600 hover:text-gray-800">
                Cart ({itemCount})
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    {getShortenedEmail(user.email)}
                  </button>
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLinkClick}
                      >
                        Profile
                      </Link>
                      {isAdmin && (
                        <Link 
                          href="/admin/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLinkClick}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLinkClick}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
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