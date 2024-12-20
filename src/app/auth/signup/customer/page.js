'use client';

import CustomerSignupForm from '../../../../components/SignupForms/CustomerSignupForm';

export default function CustomerSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Customer Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account to start shopping with us.
        </p>
        <div className="mt-8">
          <CustomerSignupForm />
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => window.history.back()} 
            className="text-sm text-[#BBA7FF] hover:text-[#A389FF]"
          >
            ← Back to options
          </button>
        </div>
      </div>
    </div>
  );
}