import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart } from "lucide-react"

// Sample related products data
const relatedProducts = [
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
    id: 8,
    name: "Rice (Local)",
    category: "Grains",
    price: 2800,
    rating: 4.6,
    origin: "Mali",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Mali Rice Farmers",
  },
  {
    id: 9,
    name: "Maize",
    category: "Grains",
    price: 1500,
    rating: 4.0,
    origin: "Burkina Faso",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Burkina Grain Collective",
  },
]

export function RelatedProducts({ category, currentProductId }: { category: string; currentProductId: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
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
  )
}