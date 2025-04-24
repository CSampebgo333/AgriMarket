import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ShoppingBag, Package, Clock, Calendar } from "lucide-react"

export function CustomerOverview() {
  // Sample customer data
  const customerData = {
    name: "Michel Bamogo",
    joinDate: "March 2023",
    totalOrders: 12,
    pendingOrders: 2,
    totalSpent: 87500,
  }

  // Stats cards data
  const stats = [
    {
      title: "Total Orders",
      value: customerData.totalOrders,
      description: "Since joining",
      icon: Package,
    },
    {
      title: "Pending",
      value: customerData.pendingOrders,
      description: "Orders in progress",
      icon: Clock,
    },
    {
      title: "Total Spent",
      value: `${customerData.totalSpent.toLocaleString()} XOF`,
      description: "Lifetime purchases",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {customerData.name}!</h2>
          <p className="text-muted-foreground">Member since {customerData.joinDate}</p>
        </div>
        <Link href="/products">
          <Button className="w-full md:w-auto hover:bg-accent hover:text-accent-foreground">
            <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/dashboard/customer/orders">
          <Button variant="outline" size="sm" className="hover:text-accent">
            View order history <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}