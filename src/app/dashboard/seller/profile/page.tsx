"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

interface SellerProfile {
  store_name: string
  store_description: string
  store_banner: string
  store_logo: string
  store_location: string
  store_country: string
  store_city: string
  store_address: string
  store_hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  shipping_policy: string
  return_policy: string
}

export default function SellerProfilePage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<SellerProfile>({
    store_name: "",
    store_description: "",
    store_banner: "",
    store_logo: "",
    store_location: "",
    store_country: "",
    store_city: "",
    store_address: "",
    store_hours: {},
    shipping_policy: "",
    return_policy: "",
  })

  const fetchProfile = useCallback(async () => {
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
  }, [showToast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = (field: keyof SellerProfile, value: string) => {
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

  if (isLoading && !profileData.store_name) {
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
                    src={profileData.store_logo || "/placeholder.svg?height=96&width=96"}
                    alt="Business Logo"
                  />
                  <AvatarFallback>{profileData.store_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-medium">{profileData.store_name || "Your Business"}</h3>
                <p className="text-sm text-muted-foreground">Seller</p>
                <p className="text-sm text-muted-foreground">Member since April 2023</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store_name">Business Name</Label>
                <Input
                  id="store_name"
                  value={profileData.store_name}
                  onChange={(e) => handleChange("store_name", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_location">Location</Label>
                <Input
                  id="store_location"
                  value={profileData.store_location}
                  onChange={(e) => handleChange("store_location", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_city">City</Label>
                <Input
                  id="store_city"
                  value={profileData.store_city}
                  onChange={(e) => handleChange("store_city", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_address">Address</Label>
                <Input
                  id="store_address"
                  value={profileData.store_address}
                  onChange={(e) => handleChange("store_address", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_description">Business Description</Label>
              <Textarea
                id="store_description"
                value={profileData.store_description}
                onChange={(e) => handleChange("store_description", e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_policy">Shipping Policy</Label>
              <Textarea
                id="shipping_policy"
                value={profileData.shipping_policy}
                onChange={(e) => handleChange("shipping_policy", e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return_policy">Return Policy</Label>
              <Textarea
                id="return_policy"
                value={profileData.return_policy}
                onChange={(e) => handleChange("return_policy", e.target.value)}
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