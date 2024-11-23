'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../app/context/CartContext'
import { useAuth } from '../app/context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../app/lib/firebase'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm py-4 fixed w-full z-50">
        <nav className="container mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight">
              GLAM GLIDE
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-8 relative">
                <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Home
                </Link>
                <Link href="/deals" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Deals
                </Link>
                <Link href="/new-arrivals" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  New Arrivals
                </Link>
                <Link href="/packages" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Packages
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none text-sm font-medium"
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
                      className="text-gray-600 py-4 hover:text-gray-800 text-sm font-medium"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => setIsSignUpModalOpen(true)}
                      className="bg-[#BBA7FF] hover:bg-[#A389FF] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                <Link href="/cart" className="text-gray-600 hover:text-gray-800 relative bg-[#BBA7FF] p-2 rounded-[10px] mr-2 sm:mr-4">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#BBA7FF] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <Link href="/cart" className="text-gray-600 hover:text-gray-800 relative bg-[#BBA7FF] p-2 rounded-[10px] mr-2 sm:mr-4">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#BBA7FF] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none p-2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 overflow-y-auto flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 space-y-6 text-center">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            <Link href="/" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>Home</Link>
            <Link href="/deals" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>Deals</Link>
            <Link href="/new-arrivals" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>New Arrivals</Link>
            <Link href="/packages" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>Packages</Link>
            {user ? (
              <>
                <Link href="/profile" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>Profile</Link>
                {isAdmin && (
                  <Link href="/admin/orders" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>Admin Dashboard</Link>
                )}
                <Link href="/orders" className="block py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200" onClick={handleLinkClick}>My Orders</Link>
                <button onClick={handleSignOut} className="block w-full text-center py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsSignInModalOpen(true); setIsMobileMenuOpen(false); }} className="block w-full text-center py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200">Sign in</button>
                <button onClick={() => { setIsSignUpModalOpen(true); setIsMobileMenuOpen(false); }} className="block w-full text-center py-3 text-gray-600 hover:text-gray-800 border-b border-gray-100 last:border-b-0 text-lg font-medium transition-colors duration-200">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="h-[72px]" /> {/* Spacer for fixed header */}
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

