import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

// Sample product inventory data
const products = [
  {
    id: 1,
    name: "Fonio Grain",
    category: "Grains",
    price: 2500,
    stock: 120,
    status: "in-stock",
  },
  {
    id: 2,
    name: "Millet",
    category: "Grains",
    price: 1800,
    stock: 85,
    status: "in-stock",
  },
  {
    id: 3,
    name: "Cassava",
    category: "Tubers",
    price: 1200,
    stock: 12,
    status: "low-stock",
  },
  {
    id: 4,
    name: "Okra",
    category: "Vegetables",
    price: 900,
    stock: 5,
    status: "low-stock",
  },
]

const statusStyles = {
  "in-stock": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "low-stock": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "out-of-stock": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function ProductInventory() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.price.toLocaleString()} XOF</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant="outline" className={statusStyles[product.status as keyof typeof statusStyles]}>
                {product.status === "in-stock"
                  ? "In Stock"
                  : product.status === "low-stock"
                    ? "Low Stock"
                    : "Out of Stock"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/dashboard/seller/products/${product.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}