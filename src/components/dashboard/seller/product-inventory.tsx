"use client";

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getToken } from "@/lib/auth"

interface Product {
  product_id: number;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
}

const statusStyles = {
  "in-stock": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "low-stock": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "out-of-stock": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function ProductInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/products?seller_id=current', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
          <TableRow key={product.product_id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.price.toLocaleString()} XOF</TableCell>
            <TableCell>{product.stock_quantity}</TableCell>
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
              <Link href={`/dashboard/seller/products/${product.product_id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}