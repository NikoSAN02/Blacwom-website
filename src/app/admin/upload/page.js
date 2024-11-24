'use client';

import { useAuth } from '../../context/AuthContext';
import BulkUpload from '../../../components/BulkUpload';

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export default function AdminUploadPage() {
  const { user } = useAuth();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <BulkUpload />;
}