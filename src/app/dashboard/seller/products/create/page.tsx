'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/product-form';
import { productService } from '@/lib/api';

export default function CreateProductPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      await productService.create(formData);
      router.push('/dashboard/seller/products');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <ProductForm onSubmit={handleSubmit} product={null} />
    </div>
  );
} 