'use client';

import Link from 'next/link';

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank you for signing up!
        </h2>
        <div className="mt-2 text-sm text-gray-600 space-y-4">
          <p>
            Please check your email for further instructions to complete your registration.
          </p>
          <p>
            You'll need to provide:
            <ul className="list-disc text-left pl-8 mt-2">
              <li>GST Number (required for wholesale dealers)</li>
              <li>At least 2 images of your establishment</li>
            </ul>
          </p>
          <p>
            Once you reply to our email with these details, we'll review your application and activate your account within 24-48 hours.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#BBA7FF] hover:bg-[#A389FF]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}