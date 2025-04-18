"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample product data
const products = [
  {
    id: 1,
    name: "Fonio Grain",
    category: "Grains",
    price: 2500,
    rating: 4.5,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Burkina Organic Farms",
  },
  {
    id: 2,
    name: "Millet",
    category: "Grains",
    price: 1800,
    rating: 4.2,
    origin: "Mali",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Mali Grain Cooperative",
  },
  {
    id: 3,
    name: "Cassava",
    category: "Tubers",
    price: 1200,
    rating: 4.0,
    origin: "Niger",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Niger Root Farms",
  },
  {
    id: 4,
    name: "Okra",
    category: "Vegetables",
    price: 900,
    rating: 4.7,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Ouaga Fresh Produce",
  },
  {
    id: 5,
    name: "Sweet Potatoes",
    category: "Tubers",
    price: 1500,
    rating: 4.3,
    origin: "Mali",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Mali Root Vegetables",
  },
  {
    id: 6,
    name: "Sorghum",
    category: "Grains",
    price: 2200,
    rating: 4.1,
    origin: "Niger",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Niger Grain Producers",
  },
  {
    id: 7,
    name: "Hibiscus",
    category: "Herbs",
    price: 3000,
    rating: 4.8,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Burkina Herb Gardens",
  },
  {
    id: 8,
    name: "Plantains",
    category: "Fruits",
    price: 1700,
    rating: 4.4,
    origin: "Mali",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Mali Fruit Farms",
  },
]

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("featured")

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0 // featured - maintain original order
    }
  })

  // Filter products based on search query
  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 right-2">{product.category}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.seller}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-muted-foreground">({product.rating})</span>
                </div>
                <p className="text-sm mt-1">Origin: {product.origin}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="font-semibold">{product.price.toLocaleString()} XOF</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
