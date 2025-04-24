"use client";

import { ProductForm } from '@/components/dashboard/seller/product-form';
import { useRouter } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const productId = params.id;

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      router.push(`/dashboard/seller/products/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
} 