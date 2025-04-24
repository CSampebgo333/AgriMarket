"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

export default function SellerProfilePage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    business_description: "",
    logo_url: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await sellerService.getProfile()
      setProfileData(response)
    } catch (error) {
      console.error("Error fetching profile:", error)
      showToast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await sellerService.updateProfile(profileData)
      showToast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !profileData.business_name) {
    return <div>Loading profile data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Business Profile</h2>
        <p className="text-muted-foreground">Manage your business information and settings.</p>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details and profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData.logo_url || "/placeholder.svg?height=96&width=96"}
                    alt="Business Logo"
                  />
                  <AvatarFallback>{profileData.business_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-medium">{profileData.business_name || "Your Business"}</h3>
                <p className="text-sm text-muted-foreground">Seller</p>
                <p className="text-sm text-muted-foreground">Member since April 2023</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={profileData.business_name}
                  onChange={(e) => handleChange("business_name", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_email">Business Email</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={profileData.business_email}
                  onChange={(e) => handleChange("business_email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_phone">Business Phone</Label>
                <Input
                  id="business_phone"
                  value={profileData.business_phone}
                  onChange={(e) => handleChange("business_phone", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address</Label>
                <Input
                  id="business_address"
                  value={profileData.business_address}
                  onChange={(e) => handleChange("business_address", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Textarea
                id="business_description"
                value={profileData.business_description}
                onChange={(e) => handleChange("business_description", e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}