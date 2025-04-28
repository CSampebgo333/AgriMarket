"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold brand-logo">AgriMarket</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="transition-colors hover:text-accent cursor-pointer nav-item">
            Home
          </Link>
          <Link href="/products" className="transition-colors hover:text-accent cursor-pointer nav-item">
            Products
          </Link>
          <Link href="/about" className="transition-colors hover:text-accent cursor-pointer nav-item">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-accent cursor-pointer nav-item">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-[10px] font-medium">
                {totalItems}
              </span>
            </Button>
          </Link>
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="cursor-pointer hover:text-accent">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="cursor-pointer hover:bg-accent hover:text-accent-foreground">Sign Up</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm transition-colors hover:text-accent cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm transition-colors hover:text-accent cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-sm transition-colors hover:text-accent cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm transition-colors hover:text-accent cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full cursor-pointer hover:text-accent">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full cursor-pointer hover:bg-accent hover:text-accent-foreground">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}