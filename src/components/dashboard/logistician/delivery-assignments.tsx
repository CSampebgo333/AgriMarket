import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { MapPin, Phone, CheckCircle, Clock } from "lucide-react"

// Sample delivery assignments
const deliveries = [
  {
    id: "DEL-001",
    customer: "Amadou Diallo",
    address: "123 Rue du Commerce, Bamako, Mali",
    phone: "+223 XX XX XX XX",
    date: new Date(2023, 4, 15),
    status: "in-progress",
    items: 3,
  },
  {
    id: "DEL-002",
    customer: "Fatima Ouedraogo",
    address: "45 Avenue de la Liberté, Ouagadougou, Burkina Faso",
    phone: "+226 XX XX XX XX",
    date: new Date(2023, 4, 15),
    status: "pending",
    items: 2,
  },
  {
    id: "DEL-003",
    customer: "Ibrahim Maiga",
    address: "78 Rue des Marchés, Niamey, Niger",
    phone: "+227 XX XX XX XX",
    date: new Date(2023, 4, 16),
    status: "pending",
    items: 4,
  },
]

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function DeliveryAssignments() {
  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{delivery.customer}</h3>
                  <Badge variant="outline" className={statusStyles[delivery.status as keyof typeof statusStyles]}>
                    {delivery.status === "in-progress"
                      ? "In Progress"
                      : delivery.status === "pending"
                        ? "Pending"
                        : delivery.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {delivery.address}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {delivery.phone}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Delivery Date: {formatDate(delivery.date)}
                </p>
                <p className="text-sm">Items: {delivery.items}</p>
              </div>
              <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                {delivery.status === "in-progress" ? (
                  <Button className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" /> Complete
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline">
                    Start Delivery
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}