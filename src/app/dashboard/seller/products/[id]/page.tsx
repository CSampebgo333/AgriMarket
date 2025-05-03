'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { productService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  status: string;
  image: string;
}

const DEFAULT_PLACEHOLDER = '/images/placeholder.svg';

export default function ProductDetailPage({ params }: PageProps) {
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

  const handleDelete = async () => {
    if (!productId) return;
    
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.delete(parseInt(productId));
      router.push('/dashboard/seller/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
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
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/seller/products/${product.id}/edit`)}
          >
            Edit Product
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-64">
          <Image
            src={product.image || DEFAULT_PLACEHOLDER}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_PLACEHOLDER;
            }}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 capitalize">{product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
              <p className="mt-1">{product.quantity}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge
                variant={
                  product.status === 'active'
                    ? 'default'
                    : product.status === 'inactive'
                    ? 'secondary'
                    : 'destructive'
                }
                className="mt-1"
              >
                {product.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 