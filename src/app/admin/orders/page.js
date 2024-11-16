'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import CancelOrderModal from '../../../components/CancelOrderModal';

const ADMIN_EMAILS = ['blacwom01@gmail.com']; // Add your admin emails here

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'orders'));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setOrders(ordersData.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user.email
      });
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date(), updatedBy: user.email }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: user.email
      });
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'cancelled',
              cancellationReason: reason,
              cancelledAt: new Date(),
              cancelledBy: user.email
            }
          : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto mt-10 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-10 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">{order.userId}</td>
                <td className="px-6 py-4">
                  {format(order.createdAt, 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4">₹{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                  {order.status === 'cancelled' && order.cancellationReason && (
                    <p className="text-sm text-red-500 mt-1">
                      Reason: {order.cancellationReason}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <div className="flex space-x-2">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setShowCancelModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="text-sm text-gray-500">
                      Cancelled by: {order.cancelledBy}
                    </span>
                  )}
                  {order.status === 'delivered' && (
                    <span className="text-sm text-green-500">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={selectedOrderId}
      />
    </div>
  );
}