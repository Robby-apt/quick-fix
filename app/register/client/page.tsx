"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Logo from "@/components/logo"
import { useAuth } from "@/lib/hooks/useAuth"
import { ApiError } from "@/lib/api/client"

export default function ClientRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { registerClient } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
      password: formData.get("password") as string,
    }

    const confirmPassword = formData.get("confirmPassword") as string
    const terms = formData.get("terms") === "on"

    // Client-side validation
    const errors: Record<string, string> = {}

    if (data.password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match"
    }

    if (!terms) {
      errors.terms = "You must accept the terms and conditions"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      await registerClient(data)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) {
          // Handle validation errors from server
          const serverErrors: Record<string, string> = {}
          for (const [field, messages] of Object.entries(error.details)) {
            if (Array.isArray(messages)) {
              serverErrors[field] = messages[0]
            }
          }
          setFieldErrors(serverErrors)
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Client Account</CardTitle>
            <CardDescription>Sign up to find and book services from trusted handymen in your area</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required disabled={isLoading} />
                    {fieldErrors.firstName && <p className="text-sm text-red-600">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required disabled={isLoading} />
                    {fieldErrors.lastName && <p className="text-sm text-red-600">{fieldErrors.lastName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      disabled={isLoading}
                    />
                    {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      required
                      disabled={isLoading}
                    />
                    {fieldErrors.phone && <p className="text-sm text-red-600">{fieldErrors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="123 Main St" required disabled={isLoading} />
                    {fieldErrors.address && <p className="text-sm text-red-600">{fieldErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required disabled={isLoading} />
                      {fieldErrors.city && <p className="text-sm text-red-600">{fieldErrors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" required disabled={isLoading} />
                      {fieldErrors.zip && <p className="text-sm text-red-600">{fieldErrors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                    {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" name="terms" required disabled={isLoading} />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {fieldErrors.terms && <p className="text-sm text-red-600">{fieldErrors.terms}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
