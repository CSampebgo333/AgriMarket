"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { sellerService } from "@/lib/api"
import { Save, Upload, MapPin } from "lucide-react"

export default function SellerStorePage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState({
    store_name: "",
    store_description: "",
    store_banner: "",
    store_logo: "",
    store_location: "",
    store_country: "burkina-faso",
    store_city: "",
    store_address: "",
    store_hours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "16:00", closed: false },
      sunday: { open: "09:00", close: "16:00", closed: true },
    },
    shipping_policy: "",
    return_policy: "",
  })

  useEffect(() => {
    fetchStoreData()
  }, [])

  const fetchStoreData = async () => {
    try {
      setIsLoading(true)
      const response = await sellerService.getProfile()
      if (response) {
        setStoreData(response)
      }
    } catch (error) {
      console.error("Error fetching store data:", error)
      showToast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setStoreData((prev) => ({ ...prev, [field]: value }))
  }

  const handleHoursChange = (day: string, field: string, value: any) => {
    setStoreData((prev) => ({
      ...prev,
      store_hours: {
        ...prev.store_hours,
        [day]: {
          ...prev.store_hours[day as keyof typeof prev.store_hours],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await sellerService.updateProfile(storeData)
      showToast({
        title: "Success",
        description: "Store profile updated successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating store profile:", error)
      showToast({
        title: "Error",
        description: "Failed to update store profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !storeData.store_name) {
    return <div>Loading store data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Store Profile</h2>
        <p className="text-muted-foreground">Manage your store information and settings.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="location">Location & Hours</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Update your store details and branding.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={storeData.store_name}
                    onChange={(e) => handleChange("store_name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_description">Store Description</Label>
                  <Textarea
                    id="store_description"
                    value={storeData.store_description}
                    onChange={(e) => handleChange("store_description", e.target.value)}
                    className="min-h-[100px]"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store_logo">Store Logo</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-md border overflow-hidden">
                        <img
                          src={storeData.store_logo || "/placeholder.svg?height=48&width=48"}
                          alt="Store Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer" disabled={isLoading}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store_banner">Store Banner</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-24 rounded-md border overflow-hidden">
                        <img
                          src={storeData.store_banner || "/placeholder.svg?height=48&width=96"}
                          alt="Store Banner"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer" disabled={isLoading}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Banner
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Update your store location information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store_country">Country</Label>
                    <Select
                      value={storeData.store_country}
                      onValueChange={(value) => handleChange("store_country", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="store_country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="burkina-faso">Burkina Faso</SelectItem>
                        <SelectItem value="mali">Mali</SelectItem>
                        <SelectItem value="niger">Niger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store_city">City</Label>
                    <Input
                      id="store_city"
                      value={storeData.store_city}
                      onChange={(e) => handleChange("store_city", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_address">Address</Label>
                  <Input
                    id="store_address"
                    value={storeData.store_address}
                    onChange={(e) => handleChange("store_address", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_location">Map Location</Label>
                  <div className="h-[200px] rounded-md border bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Map integration would be displayed here</p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your store's operating hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(storeData.store_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                        disabled={hours.closed || isLoading}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                        disabled={hours.closed || isLoading}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`closed-${day}`} className="text-sm">
                        Closed
                      </Label>
                      <input
                        id={`closed-${day}`}
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) => handleHoursChange(day, "closed", e.target.checked)}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card className="bg-white dark:bg-card">
            <CardHeader>
              <CardTitle>Store Policies</CardTitle>
              <CardDescription>Define your shipping and return policies.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shipping_policy">Shipping Policy</Label>
                  <Textarea
                    id="shipping_policy"
                    value={storeData.shipping_policy}
                    onChange={(e) => handleChange("shipping_policy", e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Describe your shipping policy, delivery times, and costs..."
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return_policy">Return Policy</Label>
                  <Textarea
                    id="return_policy"
                    value={storeData.return_policy}
                    onChange={(e) => handleChange("return_policy", e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Describe your return and refund policy..."
                    disabled={isLoading}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="cursor-pointer" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}