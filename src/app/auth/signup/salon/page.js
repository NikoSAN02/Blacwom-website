'use client';

import SalonSignupForm from '../../../../components/SignupForms/SalonSignupForm';

export default function SalonSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Salon Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide your basic information. After registration, you'll receive an email with instructions for submitting your salon details.
          </p>
        </div>
        <div className="mt-8">
          <SalonSignupForm />
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