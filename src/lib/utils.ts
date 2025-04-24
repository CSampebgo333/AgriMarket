import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generateOrderId(): string {
  return `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  if (!discountPercentage) return price
  return price - price * (discountPercentage / 100)
}

export function getStockStatus(quantity: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (quantity <= 0) return "out-of-stock"
  if (quantity < 10) return "low-stock"
  return "in-stock"
}