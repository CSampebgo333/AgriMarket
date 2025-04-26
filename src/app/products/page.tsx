"use client"

import { useState, useEffect } from "react"
import { ProductCatalog } from "@/components/products/product-catalog"
import { ProductFilters } from "@/components/products/product-filters"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"
import { productService } from "@/lib/api"
import { toast } from "sonner"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await productService.getProducts({})
      setProducts(data.products || [])
    } catch (error) {
      toast.error("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-6 md:px-8 lg:px-12 max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ProductFilters />
            </div>
            <div className="md:col-span-3">
              <ProductCatalog />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}