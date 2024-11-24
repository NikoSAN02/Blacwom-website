'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ProductDetailsModal({ isOpen, onClose, product }) {
  const [activeTab, setActiveTab] = useState('description');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.Name}</h2>
            <p className="text-gray-600 mt-1">{product.brand}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 p-4">
            {['description', 'benefits', 'how to use', 'details'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#BBA7FF] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[60vh] custom-scrollbar">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <ul className="space-y-3">
                {product.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#BBA7FF] mr-2">•</span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'how to use' && (
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Directions</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.suggestedUse}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium">{product.specifications?.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-medium">{product.specifications?.weight}</p>
                  </div>
                </div>
              </div>

              {product.specifications?.hairType && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.specifications.hairType.map((type, index) => (
                      <span 
                        key={index}
                        className="bg-[#BBA7FF]/10 text-[#BBA7FF] px-3 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications?.concerns && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Addresses</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.specifications.concerns.map((concern, index) => (
                      <span 
                        key={index}
                        className="bg-[#BBA7FF]/10 text-[#BBA7FF] px-3 py-1 rounded-full text-sm"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications?.keyIngredients && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.specifications.keyIngredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-600">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}