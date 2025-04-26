"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  Package,
  Truck,
  Users,
  BarChart,
  Settings,
  CreditCard,
  Heart,
  Star,
  Store,
  Map,
  FileText,
  HelpCircle,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  userRole: string
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname()

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${userRole}`,
        icon: Home,
      },
      {
        title: "Settings",
        href: `/dashboard/${userRole}/settings`,
        icon: Settings,
      },
    ]

    const roleSpecificItems = {
      customer: [
        {
          title: "Browse Products",
          href: `/dashboard/customer/products`,
          icon: ShoppingBag,
        },
        {
          title: "My Orders",
          href: `/dashboard/customer/orders`,
          icon: Package,
        },
        {
          title: "Profile",
          href: `/dashboard/customer/profile/personal`,
          icon: User,
        },
        {
          title: "Saved Items",
          href: `/dashboard/customer/saved`,
          icon: Heart,
        },
        {
          title: "Payment Methods",
          href: `/dashboard/customer/payments`,
          icon: CreditCard,
        },
      ],
      seller: [
        {
          title: "My Products",
          href: `/dashboard/seller/products`,
          icon: Package,
        },
        {
          title: "Orders",
          href: `/dashboard/seller/orders`,
          icon: ShoppingBag,
        },
        {
          title: "Personal Profile",
          href: `/dashboard/${userRole}/profile/personal`,
          icon: User,
        },
        {
          title: "Store Profile",
          href: `/dashboard/${userRole}/profile/business`,
          icon: Store,
        },
        {
          title: "Analytics",
          href: `/dashboard/seller/analytics`,
          icon: BarChart,
        },
      ],
      administrator: [
        {
          title: "Users",
          href: `/dashboard/administrator/users`,
          icon: Users,
        },
        {
          title: "Products",
          href: `/dashboard/administrator/products`,
          icon: Package,
        },
        {
          title: "Orders",
          href: `/dashboard/administrator/orders`,
          icon: ShoppingBag,
        },
        {
          title: "Analytics",
          href: `/dashboard/administrator/analytics`,
          icon: BarChart,
        },
        {
          title: "Reports",
          href: `/dashboard/administrator/reports`,
          icon: FileText,
        },
      ],
      logistician: [
        {
          title: "Deliveries",
          href: `/dashboard/logistician/deliveries`,
          icon: Truck,
        },
        {
          title: "Route Planning",
          href: `/dashboard/logistician/routes`,
          icon: Map,
        },
        {
          title: "Performance",
          href: `/dashboard/logistician/performance`,
          icon: Star,
        },
      ],
    }

    return [...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || []), ...baseItems]
  }

  const navItems = getNavItems()

  // <Link href="/dashboard/seller/profile/personal">Personal Profile</Link>

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">AgriMarket</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className={cn("cursor-pointer", pathname === item.href && "bg-primary/10")}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help & Support" className="cursor-pointer">
              <Link href="/help">
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}