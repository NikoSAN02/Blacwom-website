'use client';

import { useState } from 'react';
import { auth, db, storage } from '../app/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const userTypes = ['customer', 'salon', 'wholesale'];

export default function SignupForm() {
  const [userType, setUserType] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gst, setGst] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (userType !== 'customer') {
        if (images.length < 2) {
          throw new Error('Please upload at least 2 images');
        }
        if (userType === 'wholesale' && !gst) {
          throw new Error('GST number is required for wholesale accounts');
        }
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload images if any
      const imageUrls = [];
      if (images.length > 0) {
        for (const image of images) {
          const storageRef = ref(storage, `${userType}/${user.uid}/${image.name}`);
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }

      // Save user data
      await setDoc(doc(db, 'users', user.uid), {
        email,
        userType,
        gst: gst || null,
        images: imageUrls,
        status: userType === 'customer' ? 'approved' : 'pending',
        createdAt: new Date()
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Account Type</label>
          <div className="space-x-4">
            {userTypes.map(type => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {userType !== 'customer' && (
          <>
            <input
              type="text"
              placeholder="GST Number"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              className="w-full p-2 border rounded"
              required={userType === 'wholesale'}
            />

            <div>
              <label className="block mb-2">Upload Images (min 2)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}