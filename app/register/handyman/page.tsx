"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Logo from "@/components/logo"
import { useAuth } from "@/lib/hooks/useAuth"
import { ApiError } from "@/lib/api/client"

export default function HandymanRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    serviceCategory: "",
    experience: "",
    serviceArea: "",
  })
  const { registerHandyman } = useAuth()

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Roofing",
    "Carpentry",
    "Painting",
    "Cleaning",
    "HVAC",
    "Landscaping",
    "General Maintenance",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formDataObj = new FormData(e.currentTarget)
    const data = {
      firstName: formDataObj.get("firstName") as string,
      lastName: formDataObj.get("lastName") as string,
      email: formDataObj.get("email") as string,
      phone: formDataObj.get("phone") as string,
      address: formDataObj.get("address") as string,
      city: formDataObj.get("city") as string,
      zip: formDataObj.get("zip") as string,
      serviceCategory: formData.serviceCategory,
      experience: formData.experience,
      serviceArea: formData.serviceArea,
      bio: formDataObj.get("bio") as string,
      password: formDataObj.get("password") as string,
    }

    const confirmPassword = formDataObj.get("confirmPassword") as string
    const terms = formDataObj.get("terms") === "on"

    // Client-side validation
    const errors: Record<string, string> = {}

    if (data.password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match"
    }

    if (!terms) {
      errors.terms = "You must accept the terms and conditions"
    }

    if (!data.serviceCategory) {
      errors.serviceCategory = "Please select a service category"
    }

    if (!data.experience) {
      errors.experience = "Please select years of experience"
    }

    if (!data.serviceArea) {
      errors.serviceArea = "Please select a service area"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      await registerHandyman(data)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) {
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
            <CardTitle>Become a Service Provider</CardTitle>
            <CardDescription>
              Sign up to offer your professional services and connect with clients in your area
            </CardDescription>
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
                <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceCategory">Primary Service Category</Label>
                    <Select
                      value={formData.serviceCategory}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceCategory: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.serviceCategory && (
                      <p className="text-sm text-red-600">{fieldErrors.serviceCategory}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 5, 10, 15, 20].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year} {year === 1 ? "year" : "years"}
                          </SelectItem>
                        ))}
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.experience && <p className="text-sm text-red-600">{fieldErrors.experience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell potential clients about your skills, experience, and what makes your service unique..."
                      rows={4}
                      required
                      disabled={isLoading}
                    />
                    {fieldErrors.bio && <p className="text-sm text-red-600">{fieldErrors.bio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceArea">Service Area (miles)</Label>
                    <Select
                      value={formData.serviceArea}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceArea: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30, 50].map((miles) => (
                          <SelectItem key={miles} value={miles.toString()}>
                            {miles} miles
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.serviceArea && <p className="text-sm text-red-600">{fieldErrors.serviceArea}</p>}
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
