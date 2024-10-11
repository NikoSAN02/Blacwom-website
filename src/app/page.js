import ProductCard from '@/components/ProductCard'
import { getProducts } from '../app/lib/firebaseUtils'

export default async function Home() {
  let products = [];
  let error = null;
  try {
    products = await getProducts();
  } catch (e) {
    console.error("Failed to fetch products:", e);
    error = e.message;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Welcome to BlackWom</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}