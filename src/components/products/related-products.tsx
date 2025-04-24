import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { ShoppingCart } from "lucide-react"

// Update the related products data to include the correct image paths
const relatedProducts = [
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
    id: 6,
    name: "Sorghum",
    category: "Grains",
    price: 2200,
    rating: 4.1,
    origin: "Niger",
    image: "/images/sorghum.jpg",
    seller: "Niger Grain Producers",
  },
  {
    id: 8,
    name: "Rice (Local)",
    category: "Grains",
    price: 2800,
    rating: 4.6,
    origin: "Mali",
    image: "/images/rice.jpg",
    seller: "Mali Rice Farmers",
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

// Update the return statement to include better spacing and hover effects
export function RelatedProducts({ category, currentProductId }: { category: string; currentProductId: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 my-8">
      {relatedProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer"
        >
          <div className="aspect-square relative">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
            <Badge className="absolute top-2 right-2 bg-white text-foreground">{product.category}</Badge>
          </div>
          <CardContent className="p-3 pb-0">
            <div className="mb-1">
              <h3 className="font-semibold text-sm">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.seller}</p>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <StarRating rating={product.rating} size="sm" />
              <span className="text-xs text-muted-foreground">({product.rating})</span>
            </div>
            <p className="text-xs mt-1">Origin: {product.origin}</p>
          </CardContent>
          <CardFooter className="p-3 pt-2 flex justify-between items-center">
            <span className="font-semibold text-sm">{product.price.toLocaleString()} XOF</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs transition-colors hover:bg-accent">
                <ShoppingCart className="h-3 w-3 mr-1" /> Add
              </Button>
              <Button size="sm" asChild className="h-7 px-2 text-xs transition-colors">
                <Link href={`/products/${product.id}`}>View</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
