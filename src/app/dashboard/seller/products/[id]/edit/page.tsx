'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/product-form';
import { productService } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  status: string;
  image?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { id } = await params;
        setProductId(id);
        const data = await productService.getById(parseInt(id));
        setProduct(data);
      } catch (error) {
        console.error('Error initializing page:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [params]);

  const handleSubmit = async (formData: FormData) => {
    if (!productId) return;
    
    try {
      await productService.update(parseInt(productId), formData);
      router.push('/dashboard/seller/products');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm onSubmit={handleSubmit} product={product} />
    </div>
  );
} 