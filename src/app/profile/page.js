'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Profile Page</h1>
        <p>Welcome, {user?.email}</p>
        {/* Add more profile information here */}
      </div>
    </ProtectedRoute>
  );
}