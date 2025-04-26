"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Mail, Phone, User, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sellerService } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function SellerPersonalProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_image: "",
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
      console.log("Profile response:", response)
      setProfileData({
        first_name: response.first_name || "",
        last_name: response.last_name || "",
        email: response.email || "",
        phone_number: response.phone_number || "",
        profile_image: response.profile_image || "",
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
      const updateData = {
        ...profileData,
        business_email: profileData.business_email || profileData.email,
        business_phone: profileData.business_phone || profileData.phone_number,
        logo_url: profileData.logo_url || profileData.profile_image,
      }
      await sellerService.updateProfile(updateData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('profile_image', file)

      // Upload the file
      const response = await sellerService.uploadProfileImage(formData)
      
      // Update the profile data with the new image URL
      setProfileData(prev => ({
        ...prev,
        profile_image: response.imageUrl
      }))

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (isLoading && !profileData.first_name) {
    return <div>Loading profile data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personal Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and settings.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profileData.profile_image ? `${process.env.NEXT_PUBLIC_API_URL}${profileData.profile_image}` : "/placeholder.svg?height=128&width=128"}
                  alt="Profile Picture"
                />
                <AvatarFallback className="text-2xl">
                  {profileData.first_name.charAt(0)}{profileData.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold">
                {profileData.first_name} {profileData.last_name}
              </h3>
              <Badge variant="outline" className="text-sm">Seller</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={profileData.phone_number}
                      onChange={(e) => handleChange("phone_number", e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
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