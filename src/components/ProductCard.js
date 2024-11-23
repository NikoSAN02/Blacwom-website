"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../app/context/CartContext'
import { Star } from 'lucide-react'

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/placeholder-image.jpg')
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.02]">
      <div className="aspect-square relative"> 
        <Image 
          src={product.imageUrl || '/placeholder-image.jpg'} 
          alt={product.Name || 'Product image'} 
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900">{product.Name || 'Unnamed Product'}</h2>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(4.1)}
          <span className="text-sm text-gray-500 ml-1">
            (4.1k) Customer Reviews
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-gray-900">
            {typeof product.Price === 'number' 
              ? `₹${product.Price.toFixed(2)}` 
              : 'Price not available'}
          </p>
          {product.stock <= 10 && (
            <span className="text-sm text-red-500 font-medium">
              Almost Sold Out
            </span>
          )}
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-[#BBA7FF] text-white px-4 py-2.5 rounded-lg hover:bg-[#A389FF] transition-colors font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

