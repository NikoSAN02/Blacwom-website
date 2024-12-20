'use client';

import SalonSignupForm from '../../../components/SignupForms/SalonSignupForm';

export default function SalonSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Salon Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Register your salon and start buying products on a salon special price.
        </p>
        <div className="mt-8">
          <SalonSignupForm />
        </div>
      </div>
    </div>
  );
}