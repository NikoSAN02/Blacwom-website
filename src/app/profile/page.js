'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();

  // Placeholder function for image upload
  const handleImageUpload = () => {
    // Implement image upload logic here
    console.log('Image upload triggered');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={user?.photoURL || '/placeholder.svg'}
                  alt=""
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 bg-[#B388FF] hover:bg-[#9B6BFF] text-white p-2 rounded-full transition-colors"
                aria-label="Upload new picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{user?.displayName || 'No name set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user?.phoneNumber || 'No phone number set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{'No address set'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <ul className="space-y-2">
              <li>
                <button className="text-[#B388FF] hover:text-[#9B6BFF] transition-colors">
                  Change Password
                </button>
              </li>
              <li>
                <button className="text-[#B388FF] hover:text-[#9B6BFF] transition-colors">
                  Update Email
                </button>
              </li>
              <li>
                
              </li>
            </ul>
          </div>
         
        </div>
      </div>
    </ProtectedRoute>
  );
}

