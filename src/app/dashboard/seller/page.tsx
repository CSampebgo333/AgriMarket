import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SellerOverview } from "@/components/dashboard/seller/seller-overview"
import { RecentSellerOrders } from "@/components/dashboard/seller/recent-seller-orders"
import { ProductInventory } from "@/components/dashboard/seller/product-inventory"
import { SalesChart } from "@/components/dashboard/seller/sales-chart"
import { Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seller Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your store performance.</p>
        </div>
        <Link href="/dashboard/seller/products/new">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <SellerOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your sales performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your most recent customer orders</CardDescription>
            </div>
            <Link href="/dashboard/seller/orders">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentSellerOrders />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Monitor your product stock levels</CardDescription>
            </div>
            <Link href="/dashboard/seller/products">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ProductInventory />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}