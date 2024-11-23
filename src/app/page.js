import ProductCard from '@/components/ProductCard'
import { getProducts } from '../app/lib/firebaseUtils'
import { Countdown } from '@/components/Countdown'

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
    <main className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative bg-[#F8F7FF] rounded-2xl p-8 mb-16">
          
          <h1 className="text-4xl font-bold mb-4">ULTIMATE SALE</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <img src="/mainpage/360_F_706253053_EgZZT1UGDZkS88OHgX9QCAABBGSXfAk0.jpg" alt="Model 1" className="rounded-xl" />
            <img src="/mainpage/1703935772.jpg" alt="Model 2" className="rounded-xl" />
            <img src="/mainpage/gettyimages-942952390_sf.webp" alt="Model 3" className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* Deals of the Month */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Deals Of The Month</h2>
          <Countdown />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">New Arrivals</h2>
          <p className="text-gray-600">Check out our latest products from top brands</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center">
          <button className="bg-[#BBA7FF] text-white px-8 py-3 rounded-lg hover:bg-[#A389FF] transition-colors">
            View All Products
          </button>
        </div>
      </section>
    </main>
  )
}

