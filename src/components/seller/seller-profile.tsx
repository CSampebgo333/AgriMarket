"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

interface SellerProfile {
  store_name: string;
  store_description: string;
  store_banner: string;
  store_logo: string;
  store_location: string;
  store_country: string;
  store_city: string;
  store_address: string;
  store_hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  shipping_policy: string;
  return_policy: string;
}

export function SellerProfile() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  const fetchProfile = useCallback(async () => {
    try {
      const data = await sellerService.getProfile()
      setProfile(data)
    } catch {
      showToast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      await sellerService.updateProfile(profile)
      showToast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch {
      showToast({
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
                value={profile.store_name}
                onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_email">Business Email</Label>
              <Input
                id="business_email"
                type="email"
                value={profile.store_description}
                onChange={(e) => setProfile({ ...profile, store_description: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_phone">Business Phone</Label>
            <Input
              id="business_phone"
              value={profile.store_banner}
              onChange={(e) => setProfile({ ...profile, store_banner: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address">Business Address</Label>
            <Input
              id="business_address"
              value={profile.store_logo}
              onChange={(e) => setProfile({ ...profile, store_logo: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description</Label>
            <Input
              id="business_description"
              value={profile.store_location}
              onChange={(e) => setProfile({ ...profile, store_location: e.target.value })}
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