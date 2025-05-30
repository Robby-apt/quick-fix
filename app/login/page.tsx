"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/components/logo"
import { useAuth } from "@/lib/hooks/useAuth"
import { ApiError } from "@/lib/api/client"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your Quick Fix account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}
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
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register/client" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
