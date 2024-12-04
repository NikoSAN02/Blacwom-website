'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import BulkUpload from '../../../components/BulkUpload';

export default function AdminUploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
      if (user && adminEmails.includes(user.email)) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/orders"
          className="text-[#BBA7FF] hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Bulk Upload Products</h1>
      </div>
      <BulkUpload />
    </div>
  );
}