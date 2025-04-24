"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditableTable } from "@/components/dashboard/editable-table"
import { useToast } from "@/hooks/use-toast"
import { orderService } from "@/lib/api"
import { Search, FileDown } from "lucide-react"

interface Order {
  id: string
  customer: string
  date: string
  status: string
  items: number
  total: string
}

const columns = [
  { key: "id", title: "Order ID", editable: false },
  { key: "customer", title: "Customer", editable: false },
  { key: "date", title: "Date", editable: false },
  {
    key: "status",
    title: "Status",
    type: "select" as const,
    options: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" },
    ],
    editable: true,
  },
  { key: "items", title: "Items", editable: false },
  { key: "total", title: "Total", editable: false },
]

export default function SellerOrdersPage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderService.getAll()
      if (response) {
        setOrders(response)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      showToast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveOrder = async (index: number, updatedData: Record<string, any>) => {
    try {
      const orderId = orders[index].id
      await orderService.update(Number.parseInt(orderId), updatedData)

      showToast({
        title: "Success",
        description: "Order updated successfully",
        variant: "default",
      })

      fetchOrders() // Refresh the orders list
    } catch (error) {
      console.error("Error updating order:", error)
      showToast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    }
  }

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    // Additional date filtering logic would go here
    return matchesSearch && matchesStatus
  })

  if (isLoading && orders.length === 0) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage and track your customer orders.</p>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and update your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="cursor-pointer">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <EditableTable columns={columns} data={filteredOrders} onSave={handleSaveOrder} />
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <EditableTable
                  columns={columns}
                  data={filteredOrders.filter((order) => order.status === "pending")}
                  onSave={handleSaveOrder}
                />
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                <EditableTable
                  columns={columns}
                  data={filteredOrders.filter((order) => order.status === "processing")}
                  onSave={handleSaveOrder}
                />
              </TabsContent>

              <TabsContent value="shipped" className="space-y-4">
                <EditableTable
                  columns={columns}
                  data={filteredOrders.filter((order) => order.status === "shipped")}
                  onSave={handleSaveOrder}
                />
              </TabsContent>

              <TabsContent value="delivered" className="space-y-4">
                <EditableTable
                  columns={columns}
                  data={filteredOrders.filter((order) => order.status === "delivered")}
                  onSave={handleSaveOrder}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}