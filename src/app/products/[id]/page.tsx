import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/ui/star-rating"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"
import { ShoppingCart, Heart, Store, ArrowLeft } from "lucide-react"

// Sample product data (would be fetched from API in real app)
const product = {
  id: 1,
  name: "Fonio Grain",
  category: "Grains",
  price: 2500,
  rating: 4.5,
  reviewCount: 28,
  origin: "Burkina Faso",
  seller: {
    name: "Burkina Organic Farms",
    rating: 4.8,
    location: "Ouagadougou, Burkina Faso",
  },
  images: ["/images/fonio.jpg", "/images/fonio.jpg", "/images/fonio.jpg"],
  description:
    "Fonio is a nutritious ancient grain native to West Africa. It's gluten-free, easy to digest, and rich in amino acids. Our fonio is organically grown in Burkina Faso using traditional farming methods that preserve the soil and environment.",
  details: {
    weight: "1 kg",
    harvestDate: "March 2023",
    expiryDate: "March 2024",
    storageInstructions: "Store in a cool, dry place away from direct sunlight.",
    nutritionalInfo: "High in protein, fiber, and iron. Contains essential amino acids and is gluten-free.",
  },
  stock: 120,
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container py-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 ">
                  <Badge>{product.category}</Badge>
                  <Badge variant="outline">Origin: {product.origin}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-muted-foreground">
                    ({product.rating}) · {product.reviewCount} reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href={`/sellers/${product.seller.name}`} className="flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4" />
                  <span>{product.seller.name}</span>
                </Link>
                <span className="text-sm text-muted-foreground">Seller Rating: {product.seller.rating}/5</span>
              </div>

              <div className="text-2xl font-bold">{product.price.toLocaleString()} XOF</div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">In Stock: {product.stock} units</p>
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Add to Wishlist</span>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p>{product.description}</p>
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <ul className="space-y-2">
                    <li>
                      <span className="font-semibold">Weight:</span> {product.details.weight}
                    </li>
                    <li>
                      <span className="font-semibold">Harvest Date:</span> {product.details.harvestDate}
                    </li>
                    <li>
                      <span className="font-semibold">Expiry Date:</span> {product.details.expiryDate}
                    </li>
                    <li>
                      <span className="font-semibold">Storage:</span> {product.details.storageInstructions}
                    </li>
                    <li>
                      <span className="font-semibold">Nutritional Info:</span> {product.details.nutritionalInfo}
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <p>
                    We offer delivery across Burkina Faso, Mali, and Niger. Shipping costs are calculated based on
                    weight and delivery location. Typical delivery times:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Urban areas: 1-2 business days</li>
                    <li>Rural areas: 2-5 business days</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <ProductReviews productId={params.id} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <RelatedProducts category={product.category} currentProductId={params.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}