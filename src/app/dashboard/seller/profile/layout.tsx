"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SellerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <Tabs defaultValue={pathname.includes("personal") ? "personal" : "business"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" asChild>
            <Link href="/dashboard/seller/profile/personal">Personal Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="business" asChild>
            <Link href="/dashboard/seller/profile/business">Business Profile</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  )
} 