'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [userType, setUserType] = useState(null);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedAddress();
      fetchUserType();
    }
  }, [user]);

  const fetchUserType = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserType(data.user_type);
      }
    }
  };

  const getItemPrice = (item) => {
    if (!user) return item.customer_price;

    switch (userType) {
      case 'wholesale':
        return item.wholesale_price;
      case 'salon':
        return item.salon_price;
      default:
        return item.customer_price;
    }
  };

  const total = cart.reduce((sum, item) => {
    const itemPrice = getItemPrice(item);
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  const fetchSavedAddress = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('address')
        .eq('id', user.id)
        .single();

      if (!error && data?.address) {
        setAddress(data.address);
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
    setLoading(true);

    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      // Save address if requested
      if (saveAddress) {
        const { error: addressError } = await supabase
          .from('users')
          .update({ address })
          .eq('id', user.id);

        if (addressError) throw addressError;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          address: address,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items with correct pricing
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: getItemPrice(item)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Store order ID for confirmation page
      localStorage.setItem('lastOrderId', orderData.id);

      // Redirect to confirmation page
      router.push('/order-confirmation');
    } catch (error) {
      console.error("Error during checkout:", error);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      {error && <p className="text-red-500 mb-6 p-4 bg-red-50 rounded-lg">{error}</p>}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#B388FF]" />
              Shipping Address
            </h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="street">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="state">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B388FF]"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="w-4 h-4 text-[#B388FF] border-gray-300 rounded focus:ring-[#B388FF]"
                />
                <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-600">
                  Save this address for future use
                </label>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#B388FF]" />
              Payment Method
            </h2>
            <p className="text-gray-600">Payment integration to be implemented</p>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B388FF]" />
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name || 'Unnamed Product'}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {userType && userType !== 'customer' && (
                      <p className="text-sm text-green-600">
                        {userType === 'wholesale' ? 'Wholesale' : 'Salon'} Price
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    ₹{(getItemPrice(item) * (item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#BBA7FF] hover:bg-[#9B6BFF] text-white py-3 px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}