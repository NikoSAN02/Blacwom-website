'use client';

import WholesaleSignupForm from '../../../../components/SignupForms/WholesaleSignupForm';

export default function WholesaleSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Wholesale Registration
        </h2>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          Register your business and start buying products at wholesale prices.
        </p>
        <p className="mt-2 text-sm text-gray-600">
            Please provide your basic information. After registration, you'll receive an email with instructions for submitting your business details.
          </p>
        <div className="mt-8">
          <WholesaleSignupForm />
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