"use client"

import { useState } from "react"
import { ProductCatalog } from "@/components/products/product-catalog"
import { ProductFilters } from "@/components/products/product-filters"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"

interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  country_of_origin?: string;
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({})

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-6 md:px-8 lg:px-12 max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ProductFilters onFiltersChange={setFilters} />
            </div>
            <div className="md:col-span-3">
              <ProductCatalog filters={filters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}