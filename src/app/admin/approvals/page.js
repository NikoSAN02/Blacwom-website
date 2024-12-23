'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../app/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
  
      const query = supabase
        .from('users')
        .select('*')
        .in('user_type', ['salon', 'wholesale'])
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
  
      const { data, error } = await query;
      if (error) throw error;
  
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error in fetchPendingUsers:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleApproval = async (userId, approved) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: approved ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      fetchPendingUsers();

      // Send email notification about approval status
      try {
        const user = pendingUsers.find(u => u.id === userId);
        if (user) {
          await fetch('/api/send-verification-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: user.email,
              userType: user.user_type,
              isApprovalNotification: true,
              approved: approved
            }),
          });
        }
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => router.push('/admin/orders')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>
      <div>Loading...</div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => router.push('/admin/orders')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>
      <div className="grid gap-6">
        {pendingUsers.length === 0 ? (
          <p className="text-gray-600">No pending approvals</p>
        ) : (
          pendingUsers.map(user => (
            <div key={user.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{user.email}</h2>
                  <p className="text-gray-600 capitalize">{user.user_type}</p>
                  {user.gst && <p className="text-gray-600">GST: {user.gst}</p>}
                  {user.salon_name && <p className="text-gray-600">Salon: {user.salon_name}</p>}
                  {user.phone_number && <p className="text-gray-600">Phone: {user.phone_number}</p>}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApproval(user.id, true)}
                    className="bg-[#BBA7FF] hover:bg-[#A389FF] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(user.id, false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}