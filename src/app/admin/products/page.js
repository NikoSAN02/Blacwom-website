'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../app/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Save, X, Trash } from 'lucide-react';

export default function ProductManagement() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    customer_price: '',
    wholesale_price: '',
    salon_price: '',
    image_url: '',
    category: '',
    description: '',
    benefits: [],
    suggested_use: '',
    specifications: {},
    stock: ''
  });
  const [editProduct, setEditProduct] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

// Add this delete function after handleSaveEdit
const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
  
        if (error) throw error;
  
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    if (name === 'benefits') {
      setNewProduct(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else if (name === 'specifications') {
      try {
        const specObj = JSON.parse(value);
        setNewProduct(prev => ({
          ...prev,
          [name]: specObj
        }));
      } catch (e) {
        // Handle invalid JSON
        console.error('Invalid JSON for specifications');
      }
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    if (name === 'benefits') {
      setEditProduct(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else if (name === 'specifications') {
      try {
        const specObj = JSON.parse(value);
        setEditProduct(prev => ({
          ...prev,
          [name]: specObj
        }));
      } catch (e) {
        console.error('Invalid JSON for specifications');
      }
    } else {
      setEditProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      fetchProducts();
      setNewProduct({
        name: '',
        brand: '',
        customer_price: '',
        wholesale_price: '',
        salon_price: '',
        image_url: '',
        category: '',
        description: '',
        benefits: [],
        suggested_use: '',
        specifications: {},
        stock: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditProduct(product);
  };

  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(editProduct)
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => router.push('/admin/orders')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Add New Product Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={newProduct.name}
            onChange={handleNewProductChange}
            placeholder="Product Name"
            className="p-2 border rounded"
            required
          />
          <input
            name="brand"
            value={newProduct.brand}
            onChange={handleNewProductChange}
            placeholder="Brand"
            className="p-2 border rounded"
          />
          <input
            name="customer_price"
            value={newProduct.customer_price}
            onChange={handleNewProductChange}
            placeholder="Customer Price"
            type="number"
            className="p-2 border rounded"
            required
          />
          <input
            name="wholesale_price"
            value={newProduct.wholesale_price}
            onChange={handleNewProductChange}
            placeholder="Wholesale Price"
            type="number"
            className="p-2 border rounded"
            required
          />
          <input
            name="salon_price"
            value={newProduct.salon_price}
            onChange={handleNewProductChange}
            placeholder="Salon Price"
            type="number"
            className="p-2 border rounded"
            required
          />
          <input
            name="image_url"
            value={newProduct.image_url}
            onChange={handleNewProductChange}
            placeholder="Image URL"
            className="p-2 border rounded"
          />
          <input
            name="category"
            value={newProduct.category}
            onChange={handleNewProductChange}
            placeholder="Category"
            className="p-2 border rounded"
          />
          <input
            name="stock"
            value={newProduct.stock}
            onChange={handleNewProductChange}
            placeholder="Stock"
            type="number"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleNewProductChange}
            placeholder="Description"
            className="p-2 border rounded md:col-span-2"
          />
          <input
            name="benefits"
            value={newProduct.benefits.join(', ')}
            onChange={handleNewProductChange}
            placeholder="Benefits (comma-separated)"
            className="p-2 border rounded md:col-span-2"
          />
          <textarea
            name="suggested_use"
            value={newProduct.suggested_use}
            onChange={handleNewProductChange}
            placeholder="Suggested Use"
            className="p-2 border rounded md:col-span-2"
          />
          <textarea
            name="specifications"
            value={JSON.stringify(newProduct.specifications, null, 2)}
            onChange={handleNewProductChange}
            placeholder="Specifications (JSON format)"
            className="p-2 border rounded md:col-span-2"
          />
          <button
            type="submit"
            className="bg-[#BBA7FF] hover:bg-[#A389FF] text-white px-4 py-2 rounded-lg md:col-span-2"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Edit Products Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-6">Edit Products</h2>
        <div className="relative overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
            <table className="min-w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Brand</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Customer Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Wholesale Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Salon Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Benefits</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Suggested Use</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b sticky right-0 bg-gray-50">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {products.map(product => (
                    <tr key={product.id}>
                    {editingId === product.id ? (
                        <>
                        <td className="px-4 py-3">
                            <input
                            name="name"
                            value={editProduct.name}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="brand"
                            value={editProduct.brand}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="customer_price"
                            value={editProduct.customer_price}
                            onChange={handleEditProductChange}
                            type="number"
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="wholesale_price"
                            value={editProduct.wholesale_price}
                            onChange={handleEditProductChange}
                            type="number"
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="salon_price"
                            value={editProduct.salon_price}
                            onChange={handleEditProductChange}
                            type="number"
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="category"
                            value={editProduct.category}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="stock"
                            value={editProduct.stock}
                            onChange={handleEditProductChange}
                            type="number"
                            className="w-full p-1 border rounded"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <textarea
                            name="description"
                            value={editProduct.description}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            rows="2"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <input
                            name="benefits"
                            value={Array.isArray(editProduct.benefits) ? editProduct.benefits.join(', ') : ''}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            placeholder="Comma separated"
                            />
                        </td>
                        <td className="px-4 py-3">
                            <textarea
                            name="suggested_use"
                            value={editProduct.suggested_use}
                            onChange={handleEditProductChange}
                            className="w-full p-1 border rounded"
                            rows="2"
                            />
                        </td>
                        <td className="px-4 py-3 sticky right-0 bg-white">
                            <div className="flex gap-1">
                            <button
                                onClick={() => handleSaveEdit(product.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Save"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Cancel"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            </div>
                        </td>
                        </>
                    ) : (
                        <>
                        <td className="px-4 py-3 max-w-[200px] truncate">{product.name}</td>
                        <td className="px-4 py-3">{product.brand}</td>
                        <td className="px-4 py-3">₹{product.customer_price}</td>
                        <td className="px-4 py-3">₹{product.wholesale_price}</td>
                        <td className="px-4 py-3">₹{product.salon_price}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3 max-w-[300px] truncate" title={product.description}>
                            {product.description}
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate" title={Array.isArray(product.benefits) ? product.benefits.join(', ') : ''}>
                            {Array.isArray(product.benefits) ? product.benefits.join(', ') : ''}
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate" title={product.suggested_use}>
                            {product.suggested_use}
                        </td>
                        <td className="px-4 py-3 sticky right-0 bg-white">
                            <div className="flex gap-1">
                            <button
                                onClick={() => handleEditClick(product)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                            </div>
                        </td>
                        </>
                    )}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
  );
}