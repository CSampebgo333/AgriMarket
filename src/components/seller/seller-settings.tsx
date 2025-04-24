"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"

interface SellerSettings {
  notification_email: boolean
  notification_sms: boolean
  auto_approve_orders: boolean
  currency: string
  timezone: string
}

export function SellerSettings() {
  const [settings, setSettings] = useState<SellerSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await sellerService.getSettings()
      setSettings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      await sellerService.updateSettings(settings)
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      toast({
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
                checked={settings.notification_email}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notification_email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification_sms">SMS Notifications</Label>
              <Switch
                id="notification_sms"
                checked={settings.notification_sms}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notification_sms: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_approve_orders">Auto Approve Orders</Label>
              <Switch
                id="auto_approve_orders"
                checked={settings.auto_approve_orders}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, auto_approve_orders: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 