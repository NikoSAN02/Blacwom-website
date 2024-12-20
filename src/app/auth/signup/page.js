'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Choose Account Type
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select the type of account you want to create
        </p>

        <div className="mt-8 space-y-4">
          <Link 
            href="/auth/signup/salon"
            className="w-full block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">Salon Account</h3>
            <p className="mt-1 text-sm text-gray-500">
              For salon owners looking to purchase products at special rates
            </p>
          </Link>

          <Link
            href="/auth/signup/wholesale"
            className="w-full block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">Wholesale Account</h3>
            <p className="mt-1 text-sm text-gray-500">
              For wholesale dealers and distributors
            </p>
          </Link>

          <Link
            href="/auth/signup/customer"
            className="w-full block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">Customer Account</h3>
            <p className="mt-1 text-sm text-gray-500">
              For individual customers looking to purchase products
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}