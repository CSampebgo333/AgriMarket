"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"  
import { productService } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  product_id: number;
  name: string;
  category_name: string;
  price: number;
  avg_rating: number;
  country_of_origin: string;
  primary_image: string;
  seller_name: string;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = "http://localhost:4000"

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getProducts({
          limit: 4,
          sort_by: "RAND()"
        })
        setProducts(data.products || [])
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch products"
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRandomProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Discover our most popular food crops from West Africa</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Discover our most popular food crops from West Africa</p>
          </div>
          <Link href="/products">
            <Button variant="link" className="mt-4 md:mt-0 cursor-pointer">
              View all products
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <div className="aspect-square relative">
                  <Image
                    src={product.primary_image ? `${API_URL}/uploads/${product.primary_image}` : "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Badge className="absolute top-2 right-2">{product.category_name}</Badge>
                </div>
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.seller_name}</p>
                    </div>
                    <p className="font-semibold text-sm">{product.price.toLocaleString()} XOF</p>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-center gap-1">
                    <StarRating rating={product.avg_rating || 0} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {product.avg_rating ? `(${product.avg_rating})` : '(No ratings)'}
                    </span>
                  </div>
                  <p className="text-xs mt-1">Origin: {product.country_of_origin}</p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Link href={`/products/${product.product_id}`} className="w-full">
                    <Button variant="outline" className="w-full cursor-pointer h-8 text-xs">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}