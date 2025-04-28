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
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
const API_URL = "http://localhost:4000";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  primary_image: string;
  seller_id: number;
  seller_name: string;
  avg_rating: number;
  stock_quantity: number;
}

interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  country_of_origin?: string;
}

interface ProductCatalogProps {
  filters?: Filters;
}

export function ProductCatalog({ filters = {} }: ProductCatalogProps) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [sortOption, mounted, filters]);

  useEffect(() => {
    if (products.length > 0) {
      products.forEach(product => {
        console.log('Image URL:', product.primary_image);
      });
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts({
        sort_by: sortOption === "price-low" ? "price" : 
                sortOption === "price-high" ? "price" : 
                sortOption === "rating" ? "avg_rating" : "created_at",
        sort_order: sortOption === "price-low" ? "asc" : 
                   sortOption === "price-high" ? "desc" : "desc",
        category: filters.category,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        country_of_origin: filters.country_of_origin
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    const isInCart = items.some(item => item.product_id === product.product_id);
    
    if (isInCart) {
      toast.info(`${product.name} is already in your cart`, {
        description: "You can update the quantity in your cart",
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart")
        }
      });
      return;
    }

    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.primary_image ? `${API_URL}/uploads/${product.primary_image}` : "/placeholder.svg",
      seller_name: product.seller_name
    });
    
    toast.success(`${product.name} added to cart`, {
      description: `Price: ${product.price.toLocaleString()} XOF`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      }
    });
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  console.log(products);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isInCart = items.some(item => item.product_id === product.product_id);
            return (
              <Card key={product.product_id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <div className="aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={product.primary_image ? `${API_URL}/uploads/${product.primary_image}` : "/placeholder.svg"}
                      alt={`${product.name} image`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category_name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{product.price.toLocaleString()} XOF</span>
                      <StarRating rating={product.avg_rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">Sold by {product.seller_name}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </Button>
                    <Button className="flex-1" variant="outline" asChild>
                      <Link href={`/products/${product.product_id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
    </div>
  );
}