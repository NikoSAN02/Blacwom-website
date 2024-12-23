'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import CancelOrderModal from '../../../components/CancelOrderModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            user:users!orders_user_id_fkey (
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData);
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
      if (newStatus === 'shipped') {
        setSelectedOrderId(orderId);
        setShowTrackingModal(true);
        return;
      }
  
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          updated_by: user.email
        })
        .eq('id', orderId);
  
      if (updateError) throw updateError;
      
      // If status is changed to delivered, send email
      if (newStatus === 'delivered') {
        const orderToUpdate = orders.find(order => order.id === orderId);
        if (orderToUpdate && orderToUpdate.user?.email) {
          try {
            const emailResponse = await fetch('/api/send-verification-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: orderToUpdate.user.email,
                orderNumber: orderToUpdate.order_number,
                isDeliveryNotification: true
              }),
            });
      
            if (!emailResponse.ok) {
              console.error('Failed to send delivery email');
            }
          } catch (emailError) {
            console.error('Error sending delivery email:', emailError);
          }
        }
      }
      // Update local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus, 
              updated_at: new Date().toISOString(), 
              updated_by: user.email 
            }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  const handleTrackingSubmit = async () => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          tracking_id: trackingId,
          updated_at: new Date().toISOString(),
          updated_by: user.email
        })
        .eq('id', selectedOrderId);

      if (updateError) throw updateError;

      setOrders(prevOrders => prevOrders.map(order => 
        order.id === selectedOrderId 
          ? { 
              ...order, 
              status: 'shipped',
              tracking_id: trackingId,
              updated_at: new Date().toISOString(), 
              updated_by: user.email 
            }
          : order
      ));

      setShowTrackingModal(false);
      setTrackingId('');
      setSelectedOrderId(null);
    } catch (error) {
      console.error('Error updating tracking ID:', error);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const { error: cancelError } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          cancelled_by: user.email
        })
        .eq('id', orderId);

      if (cancelError) throw cancelError;
      
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'cancelled',
              cancellation_reason: reason,
              cancelled_at: new Date().toISOString(),
              cancelled_by: user.email
            }
          : order
      ));

      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const TrackingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Enter Tracking ID</h2>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter tracking ID"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleTrackingSubmit}
              className="px-4 py-2 bg-[#BBA7FF] text-white rounded-lg hover:bg-[#A389FF]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="container mx-auto mt-10 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-10 p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link 
            href="/admin/approvals"
            className="bg-[#BBA7FF] text-white px-4 py-2 rounded-lg hover:bg-[#A389FF] transition-colors"
          >
            Pending Approvals
          </Link>
          <Link 
            href="/admin/upload"
            className="bg-[#BBA7FF] text-white px-4 py-2 rounded-lg hover:bg-[#A389FF] transition-colors"
          >
            Bulk Upload Products
          </Link>
        </div>
      </div>
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
                <td className="px-6 py-4 font-medium">#{order.order_number}</td>
                <td className="px-6 py-4">{order.user?.email}</td>
                <td className="px-6 py-4">
                  {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
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
                  {order.status === 'cancelled' && order.cancellation_reason && (
                    <p className="text-sm text-red-500 mt-1">
                      Reason: {order.cancellation_reason}
                    </p>
                  )}
                  {order.status === 'shipped' && (
                    <div className="text-sm text-gray-500 mt-1">
                      Tracking ID: {order.tracking_id || 'Not available'}
                    </div>
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
                      Cancelled by: {order.cancelled_by}
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
      <TrackingModal
        isOpen={showTrackingModal}
        onClose={() => {
          setShowTrackingModal(false);
          setTrackingId('');
          setSelectedOrderId(null);
        }}
      />
    </div>
  );
}