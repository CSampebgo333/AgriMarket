"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart } from "lucide-react"
import { productService } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  seller_id: number;
  seller_name: string;
  avg_rating: number;
  stock_quantity: number;
  primary_image?: string;
}

export function RelatedProducts({ category, currentProductId }: { category: string; currentProductId: string }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = "http://localhost:4000"

  useEffect(() => {
    let isMounted = true;
    
    const fetchRelatedProducts = async () => {
      if (!category || !currentProductId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await productService.getProducts({
          category: category,
          exclude_id: currentProductId,
          limit: 4
        });
        
        if (isMounted) {
          setRelatedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        if (isMounted) {
          toast.error("Failed to fetch related products");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, [category, currentProductId]);

  if (isLoading) {
    return <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 my-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-gray-200" />
          <CardContent className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  }

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 my-8">
      {relatedProducts.map((product) => (
        <Card
          key={product.product_id}
          className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer"
        >
          <div className="aspect-square relative bg-gray-100">
            {product.primary_image ? (
              <img
                src={`${API_URL}/uploads/${product.primary_image}`}
                alt={product.name}
                className="object-cover w-full h-full"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-white text-foreground">{product.category_name}</Badge>
          </div>
          <CardContent className="p-3 pb-0">
            <div className="mb-1">
              <h3 className="font-semibold text-sm">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.seller_name}</p>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <StarRating rating={product.avg_rating || 0} size="sm" />
              <span className="text-xs text-muted-foreground">
                {product.avg_rating ? `(${product.avg_rating})` : '(No ratings)'}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-2 flex justify-between items-center">
            <span className="font-semibold text-sm">{product.price.toLocaleString()} XOF</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs transition-colors hover:bg-accent">
                <ShoppingCart className="h-3 w-3 mr-1" /> Add
              </Button>
              <Button size="sm" asChild className="h-7 px-2 text-xs transition-colors">
                <Link href={`/products/${product.product_id}`}>View</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
