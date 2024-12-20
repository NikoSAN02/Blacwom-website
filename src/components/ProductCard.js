"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '../app/context/CartContext'
import { useAuth } from '../app/context/AuthContext'
import { Star, Info } from 'lucide-react'
import ProductDetailsModal from './ProductDetailsModal'
import { supabase } from '../app/lib/supabase'

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.image_url || '/placeholder-image.jpg')
  const [showDetails, setShowDetails] = useState(false)
  const [userType, setUserType] = useState(null)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    async function getUserType() {
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
    }

    getUserType();
  }, [user]);

  const getPrice = () => {
    // If no user or userType, return customer price
    if (!user || !userType) return product.customer_price;

    // For logged in users, return price based on user type
    switch (userType) {
      case 'wholesale':
        return product.wholesale_price;
      case 'salon':
        return product.salon_price;
      default:
        return product.customer_price;
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ))
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.02]">
        <div className="aspect-square relative">
          <Image
            src={product.image_url || '/placeholder-image.jpg'}
            alt={product.name || 'Product image'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            onClick={() => setShowDetails(true)}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">{product.name || 'Unnamed Product'}</h2>
            <span className="text-sm font-medium text-gray-500">{product.brand}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(4.1)}
            <span className="text-sm text-gray-500 ml-1">
              (4.1k) Customer Reviews
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {typeof product.customer_price === 'number' 
                  ? `₹${getPrice().toFixed(2)}`
                  : 'Price not available'}
              </p>
              {userType && userType !== 'customer' && (
                <p className="text-sm text-green-600">
                  {userType === 'wholesale' ? 'Wholesale' : 'Salon'} Price
                </p>
              )}
            </div>
            {product.stock <= 10 && (
              <span className="text-sm text-red-500 font-medium">
                Almost Sold Out
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => addToCart({ ...product, price: getPrice() })}
              className="flex-1 bg-[#BBA7FF] text-white px-4 py-2.5 rounded-lg hover:bg-[#A389FF] transition-colors font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="px-4 py-2.5 rounded-lg border border-[#BBA7FF] text-[#BBA7FF] hover:bg-[#BBA7FF] hover:text-white transition-colors font-medium"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <ProductDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        product={{ ...product, price: getPrice() }}
      />
    </>
  )
}