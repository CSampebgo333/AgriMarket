"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

interface SellerProfile {
  business_name: string
  business_email: string
  business_phone: string
  business_address: string
  business_description: string
}

export function SellerProfile() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await sellerService.getProfile()
      setProfile(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      await sellerService.updateProfile(profile)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>No profile found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={profile.business_name}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_email">Business Email</Label>
              <Input
                id="business_email"
                type="email"
                value={profile.business_email}
                onChange={(e) => setProfile({ ...profile, business_email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_phone">Business Phone</Label>
            <Input
              id="business_phone"
              value={profile.business_phone}
              onChange={(e) => setProfile({ ...profile, business_phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address">Business Address</Label>
            <Input
              id="business_address"
              value={profile.business_address}
              onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description</Label>
            <Input
              id="business_description"
              value={profile.business_description}
              onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 