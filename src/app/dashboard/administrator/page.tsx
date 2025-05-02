import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminOverview } from "@/components/dashboard/administrator/admin-overview"
import { UserManagement } from "@/components/dashboard/administrator/user-management"
import { AdminSalesChart } from "@/components/dashboard/administrator/admin-sales-chart"
import { RegionalStats } from "@/components/dashboard/administrator/regional-stats"
import { ArrowRight, Download } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Administrator Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of the marketplace performance.</p>
        </div>
        <Button className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export Reports
        </Button>
      </div>

      <AdminOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Marketplace sales performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Statistics</CardTitle>
            <CardDescription>Sales distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <RegionalStats />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Recent user registrations and activity</CardDescription>
          </div>
          <Link href="/dashboard/administrator/users">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>
    </div>
  )
}