'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../lib/firebaseUtils';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}