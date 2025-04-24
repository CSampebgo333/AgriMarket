"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  seller_id: number;
  seller_name: string;
  rating: number;
  stock: number;
}

export function ProductCatalog() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [sortOption, mounted]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts({
        sort_by: sortOption === "price-low" ? "price" : 
                sortOption === "price-high" ? "price" : 
                sortOption === "rating" ? "avg_rating" : "created_at",
        sort_order: sortOption === "price-low" ? "asc" : 
                   sortOption === "price-high" ? "desc" : "desc"
      });
      setProducts(data.products || []);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{product.price} XOF</span>
                  <StarRating rating={product.rating} />
                </div>
                <p className="text-sm text-muted-foreground">Sold by {product.seller_name}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}