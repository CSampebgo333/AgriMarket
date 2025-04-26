"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SellerOverview } from "@/components/dashboard/seller/seller-overview"
import { RecentSellerOrders } from "@/components/dashboard/seller/recent-seller-orders"
import { ProductInventory } from "@/components/dashboard/seller/product-inventory"
import { SalesChart } from "@/components/dashboard/seller/sales-chart"
import { Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { sellerService } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function SellerDashboardPage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    business_name: "",
    profile_image: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await sellerService.getProfile()
      setProfile({
        first_name: response.first_name || "",
        last_name: response.last_name || "",
        business_name: response.business_name || "",
        profile_image: response.profile_image || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile.first_name}!</h1>
          <p className="text-muted-foreground">Here's an overview of your store performance.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile.profile_image || "/placeholder.svg?height=40&width=40"}
              alt="Profile Picture"
            />
            <AvatarFallback>
              {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
            <p className="text-sm text-muted-foreground">{profile.business_name}</p>
          </div>
        </div>
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