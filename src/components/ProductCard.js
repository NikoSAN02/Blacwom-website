"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/placeholder-image.jpg')

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image 
        src={imgSrc}
        alt={product.Name || 'Product image'}
        width={300} 
        height={300} 
        className="w-full h-48 object-cover"
        onError={() => setImgSrc('/placeholder-image.jpg')}
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.Name || 'Unnamed Product'}</h2>
        <p className="text-gray-600">
          {typeof product.Price === 'number' 
            ? `₹${product.Price.toFixed(2)}` 
            : 'Price not available'}
        </p>
        <Link href={`/products/${product.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Details
        </Link>
      </div>
    </div>
  )
}