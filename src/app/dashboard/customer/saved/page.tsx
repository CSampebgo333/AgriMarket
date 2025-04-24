"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { motion } from "framer-motion"
import { Search, ShoppingCart, Trash2, Heart } from "lucide-react"
import Link from "next/link"

// Sample saved items data
const savedItems = [
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
    id: 7,
    name: "Hibiscus",
    category: "Herbs",
    price: 3000,
    rating: 4.8,
    origin: "Burkina Faso",
    image: "/images/hibiscus.jpg",
    seller: "Burkina Herb Gardens",
  },
  {
    id: 9,
    name: "Maize",
    category: "Grains",
    price: 1500,
    rating: 4.0,
    origin: "Burkina Faso",
    image: "/images/maize.jpg",
    seller: "Burkina Grain Collective",
  },
]

export default function SavedItemsPage() {
  const [items, setItems] = useState(savedItems)
  const [searchQuery, setSearchQuery] = useState("")

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Saved Items</h2>
        <p className="text-muted-foreground">View and manage your saved products.</p>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Wishlist</CardTitle>
          <CardDescription>Products you've saved for later.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No saved items</h3>
                <p className="text-muted-foreground mb-6">
                  {items.length === 0 ? "You haven't saved any products yet." : "No items match your search criteria."}
                </p>
                <Button asChild className="cursor-pointer">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="border rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">{item.category}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 left-2 bg-background/80 hover:bg-background cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove from saved items</span>
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.seller}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={item.rating} />
                        <span className="text-sm text-muted-foreground">({item.rating})</span>
                      </div>
                      <p className="text-sm mb-4">Origin: {item.origin}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{item.price.toLocaleString()} XOF</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="cursor-pointer">
                            <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                          </Button>
                          <Button size="sm" asChild className="cursor-pointer">
                            <Link href={`/products/${item.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}