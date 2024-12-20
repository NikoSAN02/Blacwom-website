'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products...');
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            brand,
            customer_price,
            wholesale_price,
            salon_price,
            image_url,
            category,
            description,
            benefits,
            suggested_use,
            specifications,
            stock
          `);

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        console.log('Fetched products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

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