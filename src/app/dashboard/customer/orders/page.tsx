"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditableTable } from "@/components/dashboard/editable-table"
// import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
import { Search, FileDown, Eye } from 'lucide-react'
import Link from "next/link"

// Sample orders data
const orders = [
  {
    id: "ORD-001",
    date: "2023-04-15",
    status: "delivered",
    total: "12,500 XOF",
    items: "3",
  },
  {
    id: "ORD-002",
    date: "2023-04-28",
    status: "processing",
    total: "8,700 XOF",
    items: "2",
  },
  {
    id: "ORD-003",
    date: "2023-05-05",
    status: "shipped",
    total: "15,000 XOF",
    items: "4",
  },
  {
    id: "ORD-004",
    date: "2023-05-10",
    status: "pending",
    total: "9,000 XOF",
    items: "2",
  },
  {
    id: "ORD-005",
    date: "2023-05-15",
    status: "delivered",
    total: "11,200 XOF",
    items: "3",
  },
  {
    id: "ORD-006",
    date: "2023-05-22",
    status: "cancelled",
    total: "7,500 XOF",
    items: "1",
  },
]

const columns = [
  { key: "id", title: "Order ID", editable: false },
  { key: "date", title: "Date", editable: false },
  { key: "status", title: "Status", type: "select", options: [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ], editable: false },
  { key: "items", title: "Items", editable: false },
  { key: "total", title: "Total", editable: false },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  
  // Filter orders based on search query and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
        <p className="text-muted-foreground">View and manage your order history.</p>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track all your orders.</CardDescription>
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
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
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
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <EditableTable columns={columns} data={filteredOrders} />
              </TabsContent>
              
              <TabsContent value="active" className="space-y-4">
                <EditableTable 
                  columns={columns} 
                  data={filteredOrders.filter(order => 
                    ["pending", "processing", "shipped"].includes(order.status)
                  )} 
                />
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <EditableTable 
                  columns={columns} 
                  data={filteredOrders.filter(order => order.status === "delivered")} 
                />
              </TabsContent>
              
              <TabsContent value="cancelled" className="space-y-4">
                <EditableTable 
                  columns={columns} 
                  data={filteredOrders.filter(order => order.status === "cancelled")} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}