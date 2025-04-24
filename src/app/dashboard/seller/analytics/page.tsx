"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SalesChart } from "@/components/dashboard/seller/sales-chart"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"
import { Download, TrendingUp, TrendingDown, Users, ShoppingBag } from "lucide-react"

export default function SellerAnalyticsPage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [analyticsData, setAnalyticsData] = useState({
    sales: {
      total: 0,
      change: 0,
      data: [],
    },
    orders: {
      total: 0,
      change: 0,
    },
    customers: {
      total: 0,
      change: 0,
    },
    products: {
      total: 0,
      topSelling: [],
    },
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await sellerService.getStats()
      if (response) {
        setAnalyticsData(response)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      showToast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Track your store's performance and sales metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            {analyticsData.sales.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.sales.total.toLocaleString()} XOF</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.sales.change >= 0 ? "+" : ""}
              {analyticsData.sales.change}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            {analyticsData.orders.change >= 0 ? (
              <ShoppingBag className="h-4 w-4 text-green-500" />
            ) : (
              <ShoppingBag className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.total}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.orders.change >= 0 ? "+" : ""}
              {analyticsData.orders.change}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.customers.change >= 0 ? "+" : ""}
              {analyticsData.customers.change}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Your sales performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading product data...</div>
              ) : (
                <div className="space-y-4">
                  <p>Product analytics would be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Insights about your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading customer data...</div>
              ) : (
                <div className="space-y-4">
                  <p>Customer analytics would be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}