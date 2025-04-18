import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
import { ShoppingCart } from "@/components/cart/shopping-cart"
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

          <ShoppingCart />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
            <Link href="/checkout">
              <Button className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-4 w-4" /> Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}