import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogisticianOverview } from "@/components/dashboard/logistician/logistician-overview"
import { DeliveryAssignments } from "@/components/dashboard/logistician/delivery-assignments"
import { DeliveryMap } from "@/components/dashboard/logistician/delivery-map"
import { DeliveryHistory } from "@/components/dashboard/logistician/delivery-history"
import { ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

export default function LogisticianDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logistician Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your delivery assignments.</p>
        </div>
        <Button className="w-full md:w-auto">
          <MapPin className="mr-2 h-4 w-4" /> Update Location
        </Button>
      </div>

      <LogisticianOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>Your active delivery assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryAssignments />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
            <CardDescription>Visualize your delivery routes</CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryMap />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delivery History</CardTitle>
            <CardDescription>Your recent completed deliveries</CardDescription>
          </div>
          <Link href="/dashboard/logistician/deliveries/history">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DeliveryHistory />
        </CardContent>
      </Card>
    </div>
  )
}