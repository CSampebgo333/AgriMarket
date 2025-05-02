"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Building, MapPin, Edit, Briefcase } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sellerService } from "@/lib/api"
import { Textarea } from "@/components/ui/textarea"

interface BusinessProfileData {
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

export default function SellerBusinessProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<BusinessProfileData>({
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
      toast({
        title: "Error",
        description: "Failed to load business profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = (field: keyof BusinessProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await sellerService.updateProfile(profileData)
      toast({
        title: "Success",
        description: "Business profile updated successfully",
        variant: "default",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update business profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !profileData.store_name) {
    return <div>Loading business profile data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Profile</h2>
          <p className="text-muted-foreground">Manage your business information and settings.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Business Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profileData.store_logo || "/placeholder.svg?height=128&width=128"}
                  alt="Business Logo"
                />
                <AvatarFallback className="text-2xl">
                  <Briefcase className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold">{profileData.store_name}</h3>
              <p className="text-sm text-muted-foreground">Business Account</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="store_name">Business Name</Label>
                    <Input
                      id="store_name"
                      value={profileData.store_name}
                      onChange={(e) => handleChange("store_name", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="store_address">Business Address</Label>
                    <Input
                      id="store_address"
                      value={profileData.store_address}
                      onChange={(e) => handleChange("store_address", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="store_description">Business Description</Label>
                  <Textarea
                    id="store_description"
                    value={profileData.store_description}
                    onChange={(e) => handleChange("store_description", e.target.value)}
                    disabled={!isEditing || isLoading}
                    rows={4}
                    placeholder="Tell us about your business..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="shipping_policy">Shipping Policy</Label>
                  <Textarea
                    id="shipping_policy"
                    value={profileData.shipping_policy}
                    onChange={(e) => handleChange("shipping_policy", e.target.value)}
                    disabled={!isEditing || isLoading}
                    rows={4}
                    placeholder="Describe your shipping policy..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="return_policy">Return Policy</Label>
                  <Textarea
                    id="return_policy"
                    value={profileData.return_policy}
                    onChange={(e) => handleChange("return_policy", e.target.value)}
                    disabled={!isEditing || isLoading}
                    rows={4}
                    placeholder="Describe your return policy..."
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 