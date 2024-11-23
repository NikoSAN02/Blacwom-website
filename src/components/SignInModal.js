'use client'

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../app/lib/firebase';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative overflow-hidden">
        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                  required
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#B388FF] hover:bg-[#9B6BFF] text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#B388FF] focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
          <button
            onClick={onForgotPassword}
            className="mt-4 w-full text-center text-sm text-[#B388FF] hover:text-[#9B6BFF] transition-colors font-medium"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

