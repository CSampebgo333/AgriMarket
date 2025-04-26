"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { customerService } from "@/lib/api"
import { Camera, Save, Edit, User } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

function CustomerProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await customerService.getProfile()
      // Ensure the profile image URL is complete
      if (data.profileImage && !data.profileImage.startsWith('http')) {
        data.profileImage = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${data.profileImage}`
      }
      setProfile(data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please log in to view your profile")
        router.push("/login")
      } else {
        toast.error(error.response?.data?.message || "Failed to load profile")
      }
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Basic validation
      if (!profile.firstName || !profile.lastName || !profile.email) {
        toast.error("Please fill in all required fields")
        return
      }

      await customerService.updateProfile(profile)
      toast.success("Profile updated successfully")
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        toast.error("Please log in to update your profile")
        router.push("/login")
      } else {
        toast.error("Failed to update profile")
      }
      console.error("Error updating profile:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await customerService.uploadProfileImage(formData)
      // Ensure the image URL is complete
      const imageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${response.imageUrl}`
      
      setProfile(prev => ({ ...prev, profileImage: imageUrl }))
      toast.success("Profile image updated successfully")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image")
      console.error("Error uploading image:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
          </div>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile.firstName?.[0]}{profile.lastName?.[0] || <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full cursor-pointer bg-background/80 hover:bg-background transition-all duration-200 group-hover:scale-110"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default CustomerProfilePage 