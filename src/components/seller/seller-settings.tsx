"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

interface SellerSettings {
  id: number;
  seller_id: number;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  order_notifications: boolean;
  review_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export function SellerSettings() {
  const [settings, setSettings] = useState<SellerSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  const fetchSettings = useCallback(async () => {
    try {
      const data = await sellerService.getSettings()
      setSettings(data)
    } catch {
      showToast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      await sellerService.updateSettings(settings)
      showToast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch {
      showToast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!settings) {
    return <div>No settings found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification_email">Email Notifications</Label>
              <Switch
                id="notification_email"
                checked={settings.notification_preferences.email}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notification_preferences: { ...settings.notification_preferences, email: checked } })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification_sms">SMS Notifications</Label>
              <Switch
                id="notification_sms"
                checked={settings.notification_preferences.sms}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notification_preferences: { ...settings.notification_preferences, sms: checked } })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_approve_orders">Auto Approve Orders</Label>
              <Switch
                id="auto_approve_orders"
                checked={settings.order_notifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, order_notifications: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 