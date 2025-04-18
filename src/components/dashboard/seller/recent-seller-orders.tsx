import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/utils"

// Sample order data
const orders = [
  {
    id: "ORD-5678",
    customer: "Amadou Diallo",
    date: new Date(2023, 3, 18),
    status: "completed",
    total: 15000,
  },
  {
    id: "ORD-5679",
    customer: "Fatima Ouedraogo",
    date: new Date(2023, 3, 20),
    status: "processing",
    total: 8700,
  },
  {
    id: "ORD-5680",
    customer: "Ibrahim Maiga",
    date: new Date(2023, 4, 2),
    status: "shipped",
    total: 12500,
  },
  {
    id: "ORD-5681",
    customer: "Aisha Toure",
    date: new Date(2023, 4, 8),
    status: "pending",
    total: 9800,
  },
]

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function RecentSellerOrders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{formatDate(order.date)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={statusStyles[order.status as keyof typeof statusStyles]}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{order.total.toLocaleString()} XOF</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}