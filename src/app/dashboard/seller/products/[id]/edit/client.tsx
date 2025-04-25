"use client";

import { useEffect, useState } from 'react';
import { ProductForm } from '@/components/dashboard/seller/product-form';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditProductClientProps {
  productId: string;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  weight?: number;
  weight_unit?: string;
  country_of_origin?: string;
  expiry_date?: string;
  manufacture_date?: string;
  discount?: number;
  images: {
    image_id: number;
    image_path: string;
    is_primary: boolean;
  }[];
}

export function EditProductClient({ productId }: EditProductClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(parseInt(productId));
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
        showToast({
          title: "Error",
          description: "Failed to fetch product details",
          variant: "destructive",
        });
        router.push('/dashboard/seller/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router, showToast]);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Create a new FormData for the request
      const requestFormData = new FormData();
      
      // Append all fields from the form
      for (const [key, value] of formData.entries()) {
        if (key === 'images') {
          // Handle multiple images
          if (value instanceof File) {
            requestFormData.append('images', value);
          }
        } else if (key === 'existing_images') {
          // Handle existing images
          const existingImages = JSON.parse(value.toString());
          requestFormData.append('existing_images', JSON.stringify(existingImages));
        } else {
          // Handle other fields
          requestFormData.append(key, value.toString());
        }
      }

      // Log the FormData contents
      console.log('FormData contents:', {
        entries: Array.from(requestFormData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? { name: value.name, type: value.type, size: value.size } : value
        }))
      });

      // Update the product
      await productService.update(parseInt(productId), requestFormData);

      showToast({
        title: "Success",
        description: "Product updated successfully",
        variant: "default",
      });

      router.push(`/dashboard/seller/products/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      showToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
        <p>The product you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm 
        onSubmit={handleSubmit}
        initialData={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category_id: product.category_id,
          stock_quantity: product.stock_quantity.toString(),
          weight: product.weight?.toString(),
          weight_unit: product.weight_unit,
          country_of_origin: product.country_of_origin,
          expiry_date: product.expiry_date,
          manufacture_date: product.manufacture_date,
          discount: product.discount?.toString(),
          images: product.images.map(img => ({
            id: img.image_id,
            url: img.image_path,
            isPrimary: img.is_primary
          }))
        }}
      />
    </div>
  );
} 