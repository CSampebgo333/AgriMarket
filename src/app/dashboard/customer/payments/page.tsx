"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { EditableTable } from "@/components/dashboard/editable-table"
import { motion } from "framer-motion"
import { CreditCard, Plus, Smartphone, Trash2 } from 'lucide-react'

// Sample payment methods data
const paymentMethods = [
  {
    id: 1,
    type: "Mobile Money",
    provider: "Orange Money",
    number: "+226 70 12 34 56",
    default: true,
  },
  {
    id: 2,
    type: "Mobile Money",
    provider: "MTN Mobile Money",
    number: "+226 76 98 76 54",
    default: false,
  },
  {
    id: 3,
    type: "Bank Card",
    provider: "Visa",
    number: "**** **** **** 1234",
    expiry: "12/25",
    default: false,
  },
]

export default function PaymentsPage() {
  const [methods, setMethods] = useState(paymentMethods)
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [newMobileData, setNewMobileData] = useState({
    provider: "",
    phoneNumber: "",
  })

  const handleCardChange = (field: string, value: string) => {
    setNewCardData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMobileChange = (field: string, value: string) => {
    setNewMobileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle adding new card
    console.log("New card added:", newCardData)
    // Reset form
    setNewCardData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    })
  }

  const handleAddMobile = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle adding new mobile money
    console.log("New mobile money added:", newMobileData)
    // Reset form
    setNewMobileData({
      provider: "",
      phoneNumber: "",
    })
  }

  const handleDeleteMethod = (id: number) => {
    setMethods(methods.filter(method => method.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setMethods(methods.map(method => ({
      ...method,
      default: method.id === id
    })))
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payment Methods</h2>
        <p className="text-muted-foreground">Manage your payment methods and preferences.</p>
      </div>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Your Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {methods.map((method) => (
              <motion.div 
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  {method.type === "Mobile Money" ? (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {method.provider} {method.default && <span className="text-xs text-primary">(Default)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{method.number}</p>
                    {method.expiry && <p className="text-xs text-muted-foreground">Expires: {method.expiry}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.default && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSetDefault(method.id)}
                      className="cursor-pointer"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteMethod(method.id)}
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle>Add Payment Method</CardTitle>
          <CardDescription>Add a new payment method to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="card" className="space-y-4">
            <TabsList>
              <TabsTrigger value="card">Bank Card</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4">
              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={newCardData.cardNumber} 
                      onChange={(e) => handleCardChange("cardNumber", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={newCardData.cardName} 
                      onChange={(e) => handleCardChange("cardName", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      placeholder="MM/YY" 
                      value={newCardData.expiryDate} 
                      onChange={(e) => handleCardChange("expiryDate", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={newCardData.cvv} 
                      onChange={(e) => handleCardChange("cvv", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="mobile" className="space-y-4">
              <form onSubmit={handleAddMobile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select 
                      value={newMobileData.provider} 
                      onValueChange={(value) => handleMobileChange("provider", value)}
                    >
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orange">Orange Money</SelectItem>
                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="moov">Moov Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      placeholder="+226 XX XX XX XX" 
                      value={newMobileData.phoneNumber} 
                      onChange={(e) => handleMobileChange("phoneNumber", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Mobile Money
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}