'use client';

import { useState } from 'react';
import { supabase } from '../app/lib/supabase';
import { useRouter } from 'next/navigation';

const userTypes = ['customer', 'salon', 'wholesale'];

export default function SignupForm() {
  const router = useRouter();
  const [userType, setUserType] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gst, setGst] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (userType === 'wholesale' && !gst) {
        throw new Error('GST number is required for wholesale accounts');
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          user_type: userType,
          gst: gst || null,
          status: userType === 'customer' ? 'approved' : 'pending'
        });

      if (profileError) throw profileError;

      // Send verification email for non-customer accounts
      if (userType !== 'customer') {
        const emailResponse = await fetch('/api/send-verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            userType,
            gst: gst || null
          }),
        });

        if (!emailResponse.ok) {
          throw new Error('Failed to send verification email');
        }
      }

      router.push('/signup-success');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Account Type</label>
          <div className="space-x-4">
            {userTypes.map(type => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2 text-[#B388FF] focus:ring-[#B388FF]"
                />
                <span className="text-sm text-gray-700">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
            required
          />
        </div>

        {userType === 'wholesale' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
              required
              placeholder="Enter your GST number"
            />
            <p className="mt-1 text-sm text-gray-500">
              You will need to provide shop images after registration via email
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B388FF] hover:bg-[#9B6BFF] text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#B388FF] focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}