'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Function to generate a random order ID
const generateOrderId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};


export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => {
    const itemPrice = typeof item.Price === 'number' ? item.Price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  useEffect(() => {
    if (user) {
      fetchSavedAddress();
    }
  }, [user]);

  const fetchSavedAddress = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().address) {
        setAddress(userDoc.data().address);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!user) {
      console.log('User not logged in, redirecting to auth page');
      router.push('/auth');
      return;
    }
  
    try {
      console.log('Starting checkout process');
  
      if (saveAddress) {
        console.log('Saving address');
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { address }, { merge: true });
      }
      
      const orderId = generateOrderId();
      console.log('Generated Order ID:', orderId);
  
      console.log('Creating order in Firestore');
      await setDoc(doc(db, 'orders', orderId), {
        userId: user.uid,
        items: cart,
        total: total,
        address: address,
        createdAt: new Date()
      });
      
      console.log("Order created with ID: ", orderId);
      
      localStorage.setItem('lastOrderId', orderId);
      
      console.log('Redirecting to order confirmation page');
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push('/order-confirmation');
      }, 100);
    } catch (error) {
      console.error("Error during checkout:", error);
      setError('An error occurred during checkout. Please try again.');
    }
  };


  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCheckout}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Save this address for future use</span>
          </label>
        </div>
        <div className="mb-6">
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Complete Checkout
        </button>
      </form>
    </div>
  );
}