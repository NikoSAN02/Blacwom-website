'use client';

import Link from 'next/link';

export default function SignupSuccessPage() {
 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     <div className="max-w-2xl w-full space-y-8">
       <div className="bg-white p-8 rounded-lg shadow-sm">
         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
           Thank You for Registering!
         </h2>

         <div className="space-y-6">
           {/* Email Confirmation Section */}
           <div className="border-b border-gray-200 pb-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 First Step: Email Confirmation</h3>
             <p className="text-gray-600">
               We've sent a confirmation link to your email address. Please check your inbox (and spam folder) and click the link to verify your email.
               You won't be able to place orders until your email is confirmed.
             </p>
           </div>

           {/* Account Type Specific Instructions */}
           <div className="border-b border-gray-200 pb-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Next Steps: Account Verification</h3>
             
             <div className="space-y-4">
               <div className="bg-purple-50 p-4 rounded-lg">
                 <h4 className="font-medium text-purple-900 mb-2">For Customer Accounts</h4>
                 <p className="text-purple-700">
                   After confirming your email, you can start shopping immediately! No additional verification needed.
                 </p>
               </div>

               <div className="bg-blue-50 p-4 rounded-lg">
                 <h4 className="font-medium text-blue-900 mb-2">For Salon Accounts</h4>
                 <p className="text-blue-700 mb-2">
                   Please reply to our welcome email with:
                 </p>
                 <ul className="list-disc list-inside text-blue-700 space-y-1">
                   <li>GST number (optional)</li>
                   <li>At least 2 clear images of your salon</li>
                   <li>Valid salon registration/license</li>
                   <li>Business contact details</li>
                 </ul>
               </div>

               <div className="bg-green-50 p-4 rounded-lg">
                 <h4 className="font-medium text-green-900 mb-2">For Wholesale Accounts</h4>
                 <p className="text-green-700 mb-2">
                   Please reply to our welcome email with:
                 </p>
                 <ul className="list-disc list-inside text-green-700 space-y-1">
                   <li>GST number (required)</li>
                   <li>At least 2 clear images of your shop/warehouse</li>
                   <li>Business registration documents</li>
                   <li>Tax registration details</li>
                   <li>Business contact information</li>
                 </ul>
               </div>
             </div>
           </div>

           {/* Verification Timeline */}
           <div className="border-b border-gray-200 pb-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-3">⏱️ Verification Timeline</h3>
             <p className="text-gray-600">
               For Salon and Wholesale accounts: Once you provide all required documents, our team will review your application within 24-48 hours. 
               You'll receive an email notification when your account is approved.
             </p>
           </div>

           {/* Support Section */}
           <div>
             <h3 className="text-lg font-semibold text-gray-900 mb-3">🤝 Need Help?</h3>
             <p className="text-gray-600 mb-4">
               If you have any questions or need assistance, please contact our support team at support@glamglide.com
             </p>
           </div>
         </div>

         <div className="mt-8 text-center">
           <Link
             href="/"
             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#BBA7FF] hover:bg-[#A389FF] transition-colors duration-200"
           >
             Return to Home
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
}