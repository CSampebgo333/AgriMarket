"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("customer")

  useEffect(() => {
    // Extract user role from URL path
    // e.g., /dashboard/seller -> seller
    const pathParts = pathname.split("/")
    if (pathParts.length > 2) {
      setUserRole(pathParts[2])
    }
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar userRole={userRole} />
          <div className="flex flex-col flex-1">
            <DashboardHeader userRole={userRole} />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}