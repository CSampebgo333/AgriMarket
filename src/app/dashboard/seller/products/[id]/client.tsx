"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { productService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  status: string;
}

interface ProductDetailClientProps {
  productId: string;
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getById(parseInt(productId));
      setProduct(response);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Product Details</h1>
        <Link href={`/dashboard/seller/products/${productId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{product.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{product.category}</p>
              </div>
              <div>
                <h3 className="font-semibold">Price</h3>
                <p>{product.price.toLocaleString()} XOF</p>
              </div>
              <div>
                <h3 className="font-semibold">Stock</h3>
                <p>{product.stock} units</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{product.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 