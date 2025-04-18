import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RecentOrders } from "@/components/dashboard/customer/recent-orders"
import { RecommendedProducts } from "@/components/dashboard/customer/recommended-products"
import { CustomerOverview } from "@/components/dashboard/customer/customer-overview"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your activity.</p>
        </div>
        <Link href="/dashboard/customer/products">
          <Button className="w-full md:w-auto">
            <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
          </Button>
        </Link>
      </div>

      <CustomerOverview />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <RecentOrders />
          <div className="flex justify-end">
            <Link href="/dashboard/customer/orders">
              <Button variant="outline" size="sm">
                View all orders <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <RecommendedProducts />
          <div className="flex justify-end">
            <Link href="/dashboard/customer/products">
              <Button variant="outline" size="sm">
                View all products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}