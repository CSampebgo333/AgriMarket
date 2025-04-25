"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { productService } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  status: string;
  images: {
    image_id: number;
    image_path: string;
    is_primary: boolean;
  }[];
}

interface ProductDetailClientProps {
  productId: string;
}

const API_URL = "http://localhost:4000";

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing");
      setIsLoading(false);
      return;
    }

    const id = parseInt(productId);
    if (isNaN(id)) {
      setError("Invalid product ID");
      setIsLoading(false);
      return;
    }

    fetchProduct(id);
  }, [productId]);

  const fetchProduct = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getById(id);
      console.log("Product response:", response);
      console.log("Image URLs:", response.images.map((img: { image_path: string }) => ({
        path: img.image_path,
        fullUrl: img.image_path.startsWith('http') ? img.image_path : `${API_URL}/uploads/${img.image_path}`
      })));
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product details");
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      await productService.delete(parseInt(productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      router.push('/dashboard/seller/products');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      console.error('Error deleting product:', err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">{error}</div>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6">
        <div>Product not found</div>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
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

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.images.map((image) => (
                    <div key={image.image_id} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={image.image_path.startsWith('http') ? image.image_path : `${API_URL}/uploads/${image.image_path}`}
                          alt={`${product.name} image`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", e);
                            console.error("Image path:", image.image_path);
                            console.error("Constructed URL:", `${API_URL}/uploads/${image.image_path}`);
                          }}
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            Primary
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 