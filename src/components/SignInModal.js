'use client'

import { useState } from 'react';
import { supabase } from '../app/lib/supabase';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) throw resendError;
      setShowResendOption(false);
      setError('A new confirmation link has been sent to your email.');
    } catch (error) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResendOption(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle email confirmation error
        if (error.message.includes('Email not confirmed')) {
          setShowResendOption(true);
          throw new Error('Please confirm your email address to continue.');
        }
        throw error;
      }

      // Get user profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('status, user_type')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (userProfile.user_type === 'customer') {
        if (userProfile.status !== 'approved') {
          throw new Error('Your account needs approval. Please contact support.');
        }
      } else {
        if (userProfile.status === 'pending') {
          throw new Error('Your account is pending approval. Please check your email for instructions.');
        }
        if (userProfile.status === 'rejected') {
          throw new Error('Your account registration was not approved. Please contact support.');
        }
      }

      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
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
          {showResendOption && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              <p className="text-sm mb-2">Haven't received the confirmation email?</p>
              <button
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {resendLoading ? 'Sending...' : 'Click here to resend'}
              </button>
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B388FF] hover:bg-[#9B6BFF] text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#B388FF] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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