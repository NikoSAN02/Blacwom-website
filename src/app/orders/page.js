'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import CancelOrderModal from '../../components/CancelOrderModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          cancelled_by: user.email
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update the local state
      setOrders(orders.map(order => 
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

  if (loading) {
    return (
      <div className="container mx-auto mt-10 p-6">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.order_number}</h2>
                  <p className="text-gray-600">
                    {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                  {order.status !== 'cancelled' && 
                   order.status !== 'delivered' && (
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setShowCancelModal(true);
                      }}
                      className="block mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              {order.status === 'cancelled' && order.cancellation_reason && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <p className="text-red-700 font-medium">Cancellation Reason:</p>
                  <p className="text-red-600">{order.cancellation_reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={selectedOrderId}
      />
    </div>
  );
}