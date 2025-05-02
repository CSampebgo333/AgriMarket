"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/ui/star-rating"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
// import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"
import { ShoppingCart, Heart, Store, ArrowLeft } from "lucide-react"
import { productService } from "@/lib/api"
import { toast } from "sonner"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import Image from "next/image"  

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  seller_id: number;
  seller_name: string;
  avg_rating: number;
  stock_quantity: number;
  country_of_origin?: string;
  weight?: number;
  weight_unit?: string;
  expiry_date?: string;
  manufacture_date?: string;
  discount?: number;
  images: {
    image_id: number;
    image_path: string;
    is_primary: boolean;
    created_at: string;
  }[];
}

interface PageParams {
  id: string;
}

export default function ProductPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem, items } = useCart()
  const router = useRouter()
  const API_URL = "http://localhost:4000"

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(Number(id))
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return;

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
      image: product.images?.[0]?.image_path ? `${API_URL}/uploads/${product.images[0].image_path}` : "/placeholder.svg",
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading product details...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Product not found</div>
        </main>
        <Footer />
      </div>
    )
  }
  console.log(product)

  const isInCart = items.some(item => item.product_id === product.product_id);

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
            <div className="space-y-2">
              <div className="aspect-square relative rounded-lg overflow-hidden border max-h-100 m-left-10">
                <Image
                  src={product.images[0]?.image_path ? `${API_URL}/uploads/${product.images[0].image_path}` : "/placeholder.svg"}
                  alt={`${product.name} image`}
                  className="h-full w-full"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                  }}
                 
                />
              </div>
            </div>

            <div className="space-y-4 max-w-100">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-2">{product.category_name}</p>
              </div>

              <div className="flex items-center gap-4">
                <StarRating rating={product.avg_rating || 0} />
                <span className="text-sm text-muted-foreground">
                  {product.avg_rating ? `${product.avg_rating} stars` : 'No ratings yet'}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold">{product.price.toLocaleString()} XOF</p>
                {product.discount && (
                  <Badge variant="secondary" className="text-sm">
                    {product.discount}% off
                  </Badge>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart ? "In Cart" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="h-4 w-4" />
                <span>Sold by {product.seller_name}</span>
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
                    {product.weight && (
                      <li>
                        <span className="font-semibold">Weight:</span> {product.weight} {product.weight_unit}
                      </li>
                    )}
                    {product.country_of_origin && (
                      <li>
                        <span className="font-semibold">Origin:</span> {product.country_of_origin}
                      </li>
                    )}
                    {product.manufacture_date && (
                      <li>
                        <span className="font-semibold">Manufacture Date:</span> {new Date(product.manufacture_date).toLocaleDateString()}
                      </li>
                    )}
                    {product.expiry_date && (
                      <li>
                        <span className="font-semibold">Expiry Date:</span> {new Date(product.expiry_date).toLocaleDateString()}
                      </li>
                    )}
                  </ul>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <p>Standard shipping available. Free shipping on orders over 50,000 XOF.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* <div className="mt-16">
            <ProductReviews productId={String(product.product_id)} />
          </div> */}

          <div className="mt-16">
            <RelatedProducts category={product.category_name} currentProductId={String(product.product_id)} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}