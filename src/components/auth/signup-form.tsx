"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
  message?: string
}

interface FormData {
  user_name: string
  email: string
  password: string
  confirmPassword: string
  user_type: "Customer" | "Seller" | "Logistician"
  phone_number: string
  country: string
}

type RegistrationData = Omit<FormData, 'confirmPassword'>

export function SignupForm() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_type: "Customer",
    phone_number: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Create registration data without confirmPassword
      const registrationData: RegistrationData = {
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type,
        phone_number: formData.phone_number,
        country: formData.country
      }
      
      const response = await authService.register(registrationData)
      
      // Store token and user data
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      showToast({
        title: "Success",
        description: "Account created successfully",
        variant: "default",
      })

      // Redirect based on user type
      switch (response.data.user.user_type) {
        case "Customer":
          router.push("/dashboard/customer")
          break
        case "Seller":
          router.push("/dashboard/seller")
          break
        case "Logistician":
          router.push("/dashboard/logistician")
          break
        case "Admin":
          router.push("/dashboard/admin")
          break
        default:
          router.push("/")
      }
    } catch (err: unknown) {
      const errorMessage = 
        (err as ApiError)?.response?.data?.error || 
        (err as Error)?.message || 
        "Failed to create account"
      setError(errorMessage)
      showToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.user_name}
          onChange={(e) => handleChange("user_name", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_type">Account Type</Label>
        <Select
          value={formData.user_type}
          onValueChange={(value) => handleChange("user_type", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Seller">Seller</SelectItem>
            <SelectItem value="Logistician">Logistician</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone_number}
          onChange={(e) => handleChange("phone_number", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          placeholder="Enter your country"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  )
}