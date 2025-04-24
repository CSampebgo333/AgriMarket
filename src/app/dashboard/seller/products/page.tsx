"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditableTable } from "@/components/dashboard/editable-table"
import { motion } from "framer-motion"
import { Search, Plus, FileDown } from "lucide-react"
import Link from "next/link"
import { productService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
}

const columns = [
  { key: "id", title: "Product ID", editable: false },
  { key: "name", title: "Name", type: "text" as const },
  {
    key: "category",
    title: "Category",
    type: "select" as const,
    options: [
      { value: "Grains", label: "Grains" },
      { value: "Vegetables", label: "Vegetables" },
      { value: "Fruits", label: "Fruits" },
      { value: "Tubers", label: "Tubers" },
      { value: "Herbs", label: "Herbs" },
    ],
  },
  { key: "price", title: "Price", type: "text" as const },
  { key: "stock", title: "Stock", type: "number" as const },
  {
    key: "status",
    title: "Status",
    type: "select" as const,
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
  const [productData, setProductData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await productService.getAll({ seller_id: user.id })
      console.log('API Response:', response)
      const products = response.products.map((product: any) => ({
        id: product.product_id.toString(),
        name: product.name,
        category: product.category_name,
        price: `${product.price} XOF`,
        stock: product.stock_quantity,
        status: product.stock_quantity > 20 ? 'in-stock' : product.stock_quantity > 0 ? 'low-stock' : 'out-of-stock'
      }))
      console.log('Mapped Products:', products)
      setProductData(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search query and filters
  const filteredProducts = productData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSaveProduct = async (index: number, updatedData: Record<string, any>) => {
    try {
      const productId = filteredProducts[index].id
      // Remove XOF and any non-numeric characters from price, then parse as integer
      const price = parseInt(updatedData.price.replace(/[^0-9]/g, '')) / 100
      // Parse stock as integer
      const stock = parseInt(updatedData.stock)
      
      await productService.update(parseInt(productId), {
        name: updatedData.name,
        category: updatedData.category,
        price: price,
        stock_quantity: stock
      })
      
      showToast({
        title: "Success",
        description: "Product updated successfully",
        variant: "default",
      })
      
      fetchProducts() // Refresh the product list
    } catch (error) {
      console.error('Error updating product:', error)
      showToast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your products and inventory</p>
        </div>
        <Link href="/dashboard/seller/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {columns.find(col => col.key === 'category')?.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {columns.find(col => col.key === 'status')?.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <EditableTable
            data={filteredProducts}
            columns={columns}
            onSave={handleSaveProduct}
          />
        </CardContent>
      </Card>
    </div>
  )
}