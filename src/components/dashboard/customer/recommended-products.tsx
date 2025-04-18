import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart } from "lucide-react"

// Sample product data
const recommendedProducts = [
  {
    id: 1,
    name: "Organic Fonio",
    category: "Grains",
    price: 2800,
    rating: 4.8,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Burkina Organic Farms",
  },
  {
    id: 2,
    name: "Red Sorghum",
    category: "Grains",
    price: 1500,
    rating: 4.5,
    origin: "Mali",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Mali Grain Cooperative",
  },
  {
    id: 3,
    name: "Sweet Potatoes",
    category: "Tubers",
    price: 1000,
    rating: 4.3,
    origin: "Niger",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Niger Root Farms",
  },
  {
    id: 4,
    name: "Fresh Hibiscus",
    category: "Herbs",
    price: 1200,
    rating: 4.7,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Ouaga Fresh Produce",
  },
]

export function RecommendedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {recommendedProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
            <Badge className="absolute top-2 right-2">{product.category}</Badge>
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
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">{product.price.toLocaleString()} XOF</span>
              <Button size="sm" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
