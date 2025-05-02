"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"
import { Save } from "lucide-react"

interface SellerSettings {
  id: number
  seller_id: number
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  order_notifications: boolean
  review_notifications: boolean
  marketing_emails: boolean
  created_at: string
  updated_at: string
}

export default function SellerSettingsPage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SellerSettings>({
    id: 0,
    seller_id: 0,
    notification_preferences: {
      email: true,
      sms: false,
      push: false
    },
    order_notifications: false,
    review_notifications: false,
    marketing_emails: false,
    created_at: "",
    updated_at: ""
  })

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await sellerService.getSettings()
      setSettings(response)
    } catch (error) {
      console.error("Error fetching settings:", error)
      showToast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (field: keyof SellerSettings | "notification_preferences.email" | "notification_preferences.sms" | "notification_preferences.push", value: boolean) => {
    if (field.startsWith("notification_preferences.")) {
      const [, pref] = field.split(".")
      setSettings((prev) => ({
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [pref]: value
        }
      }))
    } else {
      setSettings((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await sellerService.updateSettings(settings)
      showToast({
        title: "Success",
        description: "Settings updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      showToast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !settings.notification_preferences.email) {
    return <div>Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Business Settings</h2>
        <p className="text-muted-foreground">Manage your business preferences and settings.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notification_email" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="notification_email"
                  checked={settings.notification_preferences.email}
                  onCheckedChange={(checked) => handleChange("notification_preferences.email", checked)}
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notification_sms" className="font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="notification_sms"
                  checked={settings.notification_preferences.sms}
                  onCheckedChange={(checked) => handleChange("notification_preferences.sms", checked)}
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notification_push" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via push</p>
                </div>
                <Switch
                  id="notification_push"
                  checked={settings.notification_preferences.push}
                  onCheckedChange={(checked) => handleChange("notification_preferences.push", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Order Settings</CardTitle>
              <CardDescription>Manage your order processing preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="order_notifications" className="font-medium">
                    Order Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch
                  id="order_notifications"
                  checked={settings.order_notifications}
                  onCheckedChange={(checked) => handleChange("order_notifications", checked)}
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="review_notifications" className="font-medium">
                    Review Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new reviews</p>
                </div>
                <Switch
                  id="review_notifications"
                  checked={settings.review_notifications}
                  onCheckedChange={(checked) => handleChange("review_notifications", checked)}
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing_emails" className="font-medium">
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                </div>
                <Switch
                  id="marketing_emails"
                  checked={settings.marketing_emails}
                  onCheckedChange={(checked) => handleChange("marketing_emails", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="cursor-pointer" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
