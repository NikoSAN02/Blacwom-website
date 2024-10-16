'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // Calculate total, ensuring it's a number
  const total = cart.reduce((sum, item) => {
    const itemPrice = typeof item.Price === 'number' ? item.Price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-500 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="flex items-center border-b py-4">
          <Image 
            src={item.imageUrl || '/placeholder-image.jpg'} 
            alt={item.Name || 'Product image'} 
            width={80} 
            height={80} 
            className="object-cover mr-4"
          />
          <div className="flex-grow">
            <h2 className="text-lg font-semibold">{item.Name || 'Unnamed Product'}</h2>
            <p className="text-gray-600">
              {typeof item.Price === 'number' 
                ? `₹${item.Price.toFixed(2)}` 
                : 'Price not available'}
            </p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              +
            </button>
          </div>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>
        <button 
          onClick={handleCheckout}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}