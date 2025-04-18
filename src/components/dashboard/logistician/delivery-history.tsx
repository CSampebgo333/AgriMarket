import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/utils"
import { Eye } from "lucide-react"

// Sample delivery history data
const deliveryHistory = [
  {
    id: "DEL-001",
    customer: "Amadou Diallo",
    address: "123 Rue du Commerce, Bamako, Mali",
    date: new Date(2023, 3, 10),
    status: "completed",
    items: 3,
    rating: 5,
  },
  {
    id: "DEL-002",
    customer: "Fatima Ouedraogo",
    address: "45 Avenue de la Liberté, Ouagadougou, Burkina Faso",
    date: new Date(2023, 3, 15),
    status: "completed",
    items: 2,
    rating: 4,
  },
  {
    id: "DEL-003",
    customer: "Ibrahim Maiga",
    address: "78 Rue des Marchés, Niamey, Niger",
    date: new Date(2023, 3, 22),
    status: "completed",
    items: 4,
    rating: 5,
  },
  {
    id: "DEL-004",
    customer: "Aisha Toure",
    address: "15 Boulevard de l'Indépendance, Bamako, Mali",
    date: new Date(2023, 4, 5),
    status: "completed",
    items: 1,
    rating: 4,
  },
]

export function DeliveryHistory() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveryHistory.map((delivery) => (
          <TableRow key={delivery.id}>
            <TableCell className="font-medium">{delivery.id}</TableCell>
            <TableCell>{delivery.customer}</TableCell>
            <TableCell>{formatDate(delivery.date)}</TableCell>
            <TableCell>{delivery.items}</TableCell>
            <TableCell>{delivery.rating}/5</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" /> Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}