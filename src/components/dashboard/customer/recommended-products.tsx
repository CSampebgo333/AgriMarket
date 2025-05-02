import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"


// Update the recommended products data to include the correct image paths
const recommendedProducts = [
  {
    id: 1,
    name: "Organic Fonio",
    category: "Grains",
    price: 2800,
    rating: 4.8,
    origin: "Burkina Faso",
    image: "/images/fonio.jpg",
    seller: "Burkina Organic Farms",
  },
  {
    id: 2,
    name: "Red Sorghum",
    category: "Grains",
    price: 1500,
    rating: 4.5,
    origin: "Mali",
    image: "/images/sorghum.jpg",
    seller: "Mali Grain Cooperative",
  },
  {
    id: 3,
    name: "Sweet Potatoes",
    category: "Tubers",
    price: 1000,
    rating: 4.3,
    origin: "Niger",
    image: "/images/sweet_potatoes.jpg",
    seller: "Niger Root Farms",
  },
  {
    id: 4,
    name: "Fresh Hibiscus",
    category: "Herbs",
    price: 1200,
    rating: 4.7,
    origin: "Burkina Faso",
    image: "/images/hibiscus.jpg",
    seller: "Ouaga Fresh Produce",
  },
]

export function RecommendedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {recommendedProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="aspect-square relative">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
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