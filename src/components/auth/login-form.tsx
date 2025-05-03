"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const router = useRouter()
  const { showToast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authService.login({ email, password })
      
      if (response.error) {
        setError(response.error)
        return
      }
      
      // Store token in cookie and user data in localStorage
      document.cookie = `token=${response.token}; path=/; max-age=2592000` // 30 days
      localStorage.setItem("user", JSON.stringify(response.user))
      
      showToast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default",
      })

      // Redirect based on user type
      switch (response.user.user_type) {
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
          router.push("/admin/users")
          break
        default:
          router.push("/")
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Invalid email or password. Please try again.";
      
      const apiError = err as { response?: { data?: { error?: string } } };
      const apiErrorMessage = apiError.response?.data?.error;
      
      setError(apiErrorMessage || errorMessage)
      showToast({
        title: "Error",
        description: apiErrorMessage || "Failed to login. Please check your credentials and try again.",
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button
          variant="link"
          className="px-0"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot password?
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
