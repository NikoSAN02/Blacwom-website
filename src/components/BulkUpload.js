'use client';

import { useState } from 'react';
import { db } from '../app/lib/firebase';
import { collection, addDoc, writeBatch } from 'firebase/firestore';
import * as XLSX from 'xlsx';

export default function BulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(worksheet);

        await uploadProducts(products);
      } catch (error) {
        console.error('Error processing file:', error);
        setError('Error processing file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadProducts = async (products) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const batch = writeBatch(db);
      const productsRef = collection(db, 'products');

      // Process products in batches of 500 (Firestore batch limit)
      for (let i = 0; i < products.length; i += 500) {
        const batch = writeBatch(db);
        const batchProducts = products.slice(i, i + 500);

        batchProducts.forEach((product) => {
          // Format the product data
          const formattedProduct = {
            Name: product.Name || '',
            brand: product.brand || '',
            Price: Number(product.Price) || 0,
            imageUrl: product.imageUrl || '',
            category: product.category || '',
            description: product.description || '',
            benefits: product.benefits ? product.benefits.split('|') : [],
            suggestedUse: product.suggestedUse || '',
            specifications: {
              weight: product.weight || '',
              size: product.size || '',
              skinType: product.skinType ? product.skinType.split('|') : [],
              concerns: product.concerns ? product.concerns.split('|') : [],
              keyIngredients: product.keyIngredients ? product.keyIngredients.split('|') : []
            },
            stock: Number(product.stock) || 0,
            createdAt: new Date()
          };

          const docRef = doc(productsRef);
          batch.set(docRef, formattedProduct);
        });

        await batch.commit();
      }

      setSuccess(`Successfully uploaded ${products.length} products`);
    } catch (error) {
      console.error('Error uploading products:', error);
      setError('Error uploading products. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Prepare an Excel file with the required columns</li>
            <li>Use | (pipe) to separate multiple values (e.g., for benefits, skinType)</li>
            <li>Ensure all required fields are filled</li>
            <li>Maximum 500 products per upload</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>

          {uploading && (
            <div className="text-blue-500">
              Uploading products... Please wait.
            </div>
          )}

          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500">
              {success}
            </div>
          )}

          <div>
            <a
              href="/sample-template.xlsx"
              download
              className="text-blue-500 hover:underline text-sm"
            >
              Download Sample Template
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}