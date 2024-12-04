'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      setPendingUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, approved) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: approved ? 'approved' : 'rejected'
      });
      fetchPendingUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>
      <div className="grid gap-6">
        {pendingUsers.map(user => (
          <div key={user.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{user.email}</h2>
                <p className="text-gray-600">{user.userType}</p>
                {user.gst && <p className="text-gray-600">GST: {user.gst}</p>}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleApproval(user.id, true)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(user.id, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {user.images?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Verification image ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}