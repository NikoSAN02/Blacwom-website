'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../../lib/firebaseUtils';
import ProductCard from '../../../components/ProductCard';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const categoryProducts = await getProductsByCategory(category);
      setProducts(categoryProducts);
    }
    fetchProducts();
  }, [category]);

  return (
    <div>
      <h1>{category} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}