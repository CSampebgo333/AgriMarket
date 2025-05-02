"use client";

import { ProductForm } from '@/components/dashboard/seller/product-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  user_type: 'Seller' | 'Customer' | 'Admin';
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser() as User | null;
    setToken(storedToken);
    setUser(storedUser);
  }, []);

  
  const handleSubmit = async (formData: FormData) => {
    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const data = await response.json();
      console.log(data);
      router.push(`/dashboard/seller/products/${data.product_id}`);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  if (!user || user.user_type !== 'Seller') {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <p>You must be logged in as a seller to create products.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
} 