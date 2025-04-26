"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Mail, Phone, Building, MapPin, Edit, Briefcase } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sellerService } from "@/lib/api"
import { Textarea } from "@/components/ui/textarea"

export default function SellerBusinessProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
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
      setProfileData({
        business_name: response.business_name || "",
        business_email: response.business_email || "",
        business_phone: response.business_phone || "",
        business_address: response.business_address || "",
        business_description: response.business_description || "",
        logo_url: response.logo_url || "",
      })
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
  }

  const handleChange = (field: string, value: string) => {
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

  if (isLoading && !profileData.business_name) {
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
                  src={profileData.logo_url || "/placeholder.svg?height=128&width=128"}
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
              <h3 className="text-xl font-semibold">{profileData.business_name}</h3>
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
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={profileData.business_name}
                      onChange={(e) => handleChange("business_name", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="business_email">Business Email</Label>
                    <Input
                      id="business_email"
                      type="email"
                      value={profileData.business_email}
                      onChange={(e) => handleChange("business_email", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="business_phone">Business Phone</Label>
                    <Input
                      id="business_phone"
                      value={profileData.business_phone}
                      onChange={(e) => handleChange("business_phone", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="business_address">Business Address</Label>
                    <Input
                      id="business_address"
                      value={profileData.business_address}
                      onChange={(e) => handleChange("business_address", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="business_description">Business Description</Label>
                  <Textarea
                    id="business_description"
                    value={profileData.business_description}
                    onChange={(e) => handleChange("business_description", e.target.value)}
                    disabled={!isEditing || isLoading}
                    rows={4}
                    placeholder="Tell us about your business..."
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4">
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