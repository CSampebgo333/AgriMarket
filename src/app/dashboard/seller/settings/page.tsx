"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"
import { Save } from "lucide-react"

export default function SellerSettingsPage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    notification_email: true,
    notification_sms: false,
    auto_approve_orders: false,
    currency: "XOF",
    timezone: "Africa/Ouagadougou",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
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
  }

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
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

  if (isLoading && !settings.currency) {
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
                  checked={settings.notification_email}
                  onCheckedChange={(checked) => handleChange("notification_email", checked)}
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
                  checked={settings.notification_sms}
                  onCheckedChange={(checked) => handleChange("notification_sms", checked)}
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
                  <Label htmlFor="auto_approve_orders" className="font-medium">
                    Auto Approve Orders
                  </Label>
                  <p className="text-sm text-muted-foreground">Automatically approve new orders</p>
                </div>
                <Switch
                  id="auto_approve_orders"
                  checked={settings.auto_approve_orders}
                  onCheckedChange={(checked) => handleChange("auto_approve_orders", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Manage your currency and timezone preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleChange("currency", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">XOF (CFA Franc)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleChange("timezone", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Ouagadougou">Ouagadougou (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Bamako">Bamako (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Niamey">Niamey (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
