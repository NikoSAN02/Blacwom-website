'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const orderFetched = useRef(false);

  useEffect(() => {
    console.log('Order Confirmation useEffect triggered');
    
    const fetchOrderDetails = async () => {
      if (orderFetched.current) return;

      const orderId = localStorage.getItem('lastOrderId');
      console.log('Order ID from localStorage:', orderId);

      if (!user || !orderId) {
        setError('No order found. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          console.log('Order found:', orderDoc.data());
          setOrderDetails({ ...orderDoc.data(), id: orderId });
          clearCart();
        } else {
          console.log('Order not found in Firestore');
          setError('Order not found. Please contact customer support.');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Error fetching order details. Please try again.');
      } finally {
        setIsLoading(false);
        localStorage.removeItem('lastOrderId');
        orderFetched.current = true;
      }
    };

    fetchOrderDetails();
  }, [user, clearCart]);

  console.log('Render state:', { isLoading, error, orderDetails });

  if (isLoading) {
    return <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="mb-4">No order details found.</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Confirmation</h1>
      <div className="text-center mb-6">
        <p className="text-xl mb-2">Thank you for your order!</p>
        <p className="text-lg">Your order number is: <span className="font-bold">{orderDetails.id}</span></p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {orderDetails.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.Name} x {item.quantity}</span>
            <span>₹{(item.Price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>₹{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
        <p>{orderDetails.address.street}</p>
        <p>{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipCode}</p>
        <p>{orderDetails.address.country}</p>
      </div>
      <div className="text-center">
        <p className="mb-4">We'll send you an email with your order details and tracking information once your order ships.</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}