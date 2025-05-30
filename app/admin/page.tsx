"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Users, Wrench, TrendingUp } from "lucide-react"
import AdminDashboardLayout from "@/components/layouts/admin-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useBookings } from "@/lib/hooks/useBookings"
import { useState, useEffect, useMemo } from "react"
import { apiClient } from "@/lib/api/client"

interface AdminStats {
  totalUsers: number
  totalHandymen: number
  completedBookings: number
  openTickets: number
}

interface User {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  created_at: string
  service_category?: string
  experience_years?: number
  is_verified?: boolean
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { bookings } = useBookings()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalHandymen: 0,
    completedBookings: 0,
    openTickets: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifyingHandyman, setVerifyingHandyman] = useState<string | null>(null)

  // Calculate stats from bookings
  const bookingStats = useMemo(() => {
    const completedThisMonth = bookings.filter(
      (booking) => booking.status === "completed" && new Date(booking.date).getMonth() === new Date().getMonth(),
    ).length

    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length

    return {
      completedThisMonth,
      pendingBookings,
      totalRevenue: bookings
        .filter((booking) => booking.status === "completed")
        .reduce((sum, booking) => sum + booking.price, 0),
    }
  }, [bookings])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch admin stats
      const statsResponse = await apiClient.getAdminStats()
      setStats(statsResponse.stats)

      // For now, we'll simulate user data since we don't have a users endpoint
      // In a real app, you'd have an admin endpoint to fetch all users
      const mockUsers: User[] = [
        {
          id: "1",
          email: "john@example.com",
          role: "client",
          first_name: "John",
          last_name: "Doe",
          created_at: "2024-03-10T00:00:00Z",
        },
        {
          id: "2",
          email: "mike@example.com",
          role: "handyman",
          first_name: "Mike",
          last_name: "Smith",
          created_at: "2024-03-12T00:00:00Z",
          service_category: "plumbing",
          experience_years: 15,
          is_verified: true,
        },
        {
          id: "3",
          email: "sarah@example.com",
          role: "client",
          first_name: "Sarah",
          last_name: "Johnson",
          created_at: "2024-03-08T00:00:00Z",
        },
        {
          id: "4",
          email: "david@example.com",
          role: "handyman",
          first_name: "David",
          last_name: "Wilson",
          created_at: "2024-03-07T00:00:00Z",
          service_category: "electrical",
          experience_years: 8,
          is_verified: false,
        },
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyHandyman = async (handymanId: string) => {
    try {
      setVerifyingHandyman(handymanId)
      await apiClient.verifyHandyman(handymanId)

      // Update local state
      setUsers((prev) => prev.map((user) => (user.id === handymanId ? { ...user, is_verified: true } : user)))
    } catch (error) {
      console.error("Failed to verify handyman:", error)
    } finally {
      setVerifyingHandyman(null)
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to view this page.</p>
          </div>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Service Providers</p>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{loading ? "..." : stats.totalHandymen}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Active handymen</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{bookingStats.completedThisMonth}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">${bookingStats.totalRevenue.toFixed(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total platform revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Support Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking, index) => (
                  <div key={booking.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.status === "completed" ? "Job completed" : "New booking"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.service_title} - ${booking.price}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>Handymen awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users
                  .filter((user) => user.role === "handyman" && !user.is_verified)
                  .map((handyman) => (
                    <div key={handyman.id} className="flex flex-col p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {handyman.first_name} {handyman.last_name}
                            </h3>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{handyman.email}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {handyman.service_category} • {handyman.experience_years} years experience
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleVerifyHandyman(handyman.id)}
                          disabled={verifyingHandyman === handyman.id}
                        >
                          {verifyingHandyman === handyman.id ? "Verifying..." : "Verify"}
                        </Button>
                      </div>
                    </div>
                  ))}
                {users.filter((user) => user.role === "handyman" && !user.is_verified).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No pending verifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage clients and service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="providers">Service Providers</TabsTrigger>
              </TabsList>

              <TabsContent value="clients">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Joined</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {users
                    .filter((user) => user.role === "client")
                    .map((client) => (
                      <div key={client.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                        <div>
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-muted-foreground">{client.email}</div>
                        <div className="text-muted-foreground">{new Date(client.created_at).toLocaleDateString()}</div>
                        <div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="destructive">
                            Suspend
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="providers">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Service</div>
                    <div>Email</div>
                    <div>Joined</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {users
                    .filter((user) => user.role === "handyman")
                    .map((provider) => (
                      <div key={provider.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                        <div>
                          {provider.first_name} {provider.last_name}
                        </div>
                        <div className="text-muted-foreground capitalize">{provider.service_category}</div>
                        <div className="text-muted-foreground">{provider.email}</div>
                        <div className="text-muted-foreground">
                          {new Date(provider.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              provider.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {provider.is_verified ? "Verified" : "Pending"}
                          </span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {!provider.is_verified ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerifyHandyman(provider.id)}
                              disabled={verifyingHandyman === provider.id}
                            >
                              {verifyingHandyman === provider.id ? "Verifying..." : "Verify"}
                            </Button>
                          ) : (
                            <Button size="sm" variant="destructive">
                              Suspend
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
