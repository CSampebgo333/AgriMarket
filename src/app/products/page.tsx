import { ProductCatalog } from "@/components/products/product-catalog"
import { ProductFilters } from "@/components/products/product-filters"
import { LandingNavbar } from "@/components/layout/landing-navbar"
import { Footer } from "@/components/layout/footer"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <div className="container py-8">
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