"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditableTable } from "@/components/dashboard/editable-table"
import { motion } from "framer-motion"
import { Search, Plus, FileDown } from "lucide-react"
import Link from "next/link"

// Sample products data
const products = [
  {
    id: "PRD-001",
    name: "Fonio Grain",
    category: "Grains",
    price: "2,500 XOF",
    stock: "120",
    status: "in-stock",
  },
  {
    id: "PRD-002",
    name: "Millet",
    category: "Grains",
    price: "1,800 XOF",
    stock: "85",
    status: "in-stock",
  },
  {
    id: "PRD-003",
    name: "Cassava",
    category: "Tubers",
    price: "1,200 XOF",
    stock: "12",
    status: "low-stock",
  },
  {
    id: "PRD-004",
    name: "Okra",
    category: "Vegetables",
    price: "900 XOF",
    stock: "5",
    status: "low-stock",
  },
  {
    id: "PRD-005",
    name: "Hibiscus",
    category: "Herbs",
    price: "3,000 XOF",
    stock: "50",
    status: "in-stock",
  },
  {
    id: "PRD-006",
    name: "Sweet Potatoes",
    category: "Tubers",
    price: "1,500 XOF",
    stock: "30",
    status: "in-stock",
  },
]

const columns = [
  { key: "id", title: "Product ID", editable: false },
  { key: "name", title: "Name", type: "text" },
  {
    key: "category",
    title: "Category",
    type: "select",
    options: [
      { value: "Grains", label: "Grains" },
      { value: "Vegetables", label: "Vegetables" },
      { value: "Fruits", label: "Fruits" },
      { value: "Tubers", label: "Tubers" },
      { value: "Herbs", label: "Herbs" },
    ],
  },
  { key: "price", title: "Price", type: "text" },
  { key: "stock", title: "Stock", type: "number" },
  {
    key: "status",
    title: "Status",
    type: "select",
    options: [
      { value: "in-stock", label: "In Stock" },
      { value: "low-stock", label: "Low Stock" },
      { value: "out-of-stock", label: "Out of Stock" },
    ],
  },
]

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productData, setProductData] = useState(products)

  // Filter products based on search query and filters
  const filteredProducts = productData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSaveProduct = (index: number, updatedData: Record<string, any>) => {
    const newProductData = [...productData]
    newProductData[index] = updatedData
    setProductData(newProductData)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Products</h2>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Link href="/dashboard/seller/products/new">
          <Button className="w-full md:w-auto cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage and update your product listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Tubers">Tubers</SelectItem>
                  <SelectItem value="Herbs">Herbs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="cursor-pointer">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <EditableTable columns={columns} data={filteredProducts} onSave={handleSaveProduct} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}