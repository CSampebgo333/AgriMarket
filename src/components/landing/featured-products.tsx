"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { motion } from "framer-motion"

// Sample product data
const featuredProducts = [
  {
    id: 1,
    name: "Fonio Grain",
    category: "Grains",
    price: 2500,
    rating: 4.5,
    origin: "Burkina Faso",
    image: "/images/fonio.jpg",
    seller: "Burkina Organic Farms",
  },
  {
    id: 2,
    name: "Millet",
    category: "Grains",
    price: 1800,
    rating: 4.2,
    origin: "Mali",
    image: "/images/millet.jpg",
    seller: "Mali Grain Cooperative",
  },
  {
    id: 3,
    name: "Cassava",
    category: "Tubers",
    price: 1200,
    rating: 4.0,
    origin: "Niger",
    image: "/images/cassava.jpg",
    seller: "Niger Root Farms",
  },
  {
    id: 4,
    name: "Okra",
    category: "Vegetables",
    price: 900,
    rating: 4.7,
    origin: "Burkina Faso",
    image: "/images/okra.jpg",
    seller: "Ouaga Fresh Produce",
  },
]

export function FeaturedProducts() {
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
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">{product.category}</Badge>
                </div>
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.seller}</p>
                    </div>
                    <p className="font-semibold text-sm">{product.price} XOF</p>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">({product.rating})</span>
                  </div>
                  <p className="text-xs mt-1">Origin: {product.origin}</p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Link href={`/products/${product.id}`} className="w-full">
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