import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function getProducts() {
  try {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        Name: data.Name || 'Unnamed Product',
        Price: typeof data.Price === 'number' ? data.Price : null,
        imageUrl: data.imageUrl || '/placeholder-image.jpg',
      };
    });
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}