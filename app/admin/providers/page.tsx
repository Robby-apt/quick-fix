"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MoreHorizontal, UserCheck, UserX, Eye, Star, MapPin } from "lucide-react"
import AdminDashboardLayout from "@/components/layouts/admin-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useState, useEffect, useMemo } from "react"
import { apiClient } from "@/lib/api/client"

interface ServiceProvider {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  zip: string
  service_category: string
  experience_years: number
  service_area: string
  bio: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  last_login?: string
  rating: number
  total_jobs: number
  total_earnings: number
}

export default function AdminProvidersPage() {
  const { user } = useAuth()
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [verifyingProvider, setVerifyingProvider] = useState<string | null>(null)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockProviders: ServiceProvider[] = [
          {
            id: "1",
            email: "mike.smith@example.com",
            first_name: "Mike",
            last_name: "Smith",
            phone: "+1 (555) 234-5678",
            address: "456 Oak Ave",
            city: "New York",
            zip: "10002",
            service_category: "plumbing",
            experience_years: 15,
            service_area: "Manhattan, Brooklyn",
            bio: "Professional plumber with 15 years of experience. Specializing in residential and commercial plumbing repairs.",
            is_verified: true,
            is_active: true,
            created_at: "2024-03-12T00:00:00Z",
            last_login: "2024-03-15T09:15:00Z",
            rating: 4.8,
            total_jobs: 127,
            total_earnings: 15420,
          },
          {
            id: "2",
            email: "david.wilson@example.com",
            first_name: "David",
            last_name: "Wilson",
            phone: "+1 (555) 456-7890",
            address: "321 Elm St",
            city: "Queens",
            zip: "11101",
            service_category: "electrical",
            experience_years: 8,
            service_area: "Queens, Manhattan",
            bio: "Licensed electrician providing safe and reliable electrical services for homes and businesses.",
            is_verified: false,
            is_active: true,
            created_at: "2024-03-07T00:00:00Z",
            last_login: "2024-03-13T14:20:00Z",
            rating: 4.6,
            total_jobs: 43,
            total_earnings: 6780,
          },
          {
            id: "3",
            email: "robert.brown@example.com",
            first_name: "Robert",
            last_name: "Brown",
            phone: "+1 (555) 678-9012",
            address: "789 Pine St",
            city: "Brooklyn",
            zip: "11201",
            service_category: "carpentry",
            experience_years: 12,
            service_area: "Brooklyn, Queens",
            bio: "Skilled carpenter specializing in custom furniture, home renovations, and repair work.",
            is_verified: true,
            is_active: true,
            created_at: "2024-02-28T00:00:00Z",
            last_login: "2024-03-14T11:30:00Z",
            rating: 4.9,
            total_jobs: 89,
            total_earnings: 12340,
          },
          {
            id: "4",
            email: "james.anderson@example.com",
            first_name: "James",
            last_name: "Anderson",
            phone: "+1 (555) 789-0123",
            address: "654 Maple Ave",
            city: "Manhattan",
            zip: "10003",
            service_category: "painting",
            experience_years: 6,
            service_area: "Manhattan",
            bio: "Professional painter offering interior and exterior painting services with attention to detail.",
            is_verified: false,
            is_active: true,
            created_at: "2024-03-01T00:00:00Z",
            last_login: "2024-03-12T16:45:00Z",
            rating: 4.4,
            total_jobs: 28,
            total_earnings: 3920,
          },
        ]
        setProviders(mockProviders)
      } catch (error) {
        console.error("Failed to fetch providers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  const filteredProviders = useMemo(() => {
    if (!searchQuery) return providers

    return providers.filter(
      (provider) =>
        provider.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.service_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [providers, searchQuery])

  const handleVerifyProvider = async (providerId: string) => {
    try {
      setVerifyingProvider(providerId)
      await apiClient.verifyHandyman(providerId)
      setProviders((prev) =>
        prev.map((provider) => (provider.id === providerId ? { ...provider, is_verified: true } : provider)),
      )
    } catch (error) {
      console.error("Failed to verify provider:", error)
    } finally {
      setVerifyingProvider(null)
    }
  }

  const stats = useMemo(() => {
    const verified = providers.filter((p) => p.is_verified).length
    const pending = providers.filter((p) => !p.is_verified).length
    const active = providers.filter((p) => p.is_active).length

    return { verified, pending, active, total: providers.length }
  }, [providers])

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Service Providers</h1>
            <p className="text-muted-foreground">Manage handymen and service professionals</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Providers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending Verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>All registered handymen and service professionals</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {provider.first_name} {provider.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{provider.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{provider.service_category}</TableCell>
                      <TableCell>{provider.experience_years} years</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {provider.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                          {provider.rating}
                        </div>
                      </TableCell>
                      <TableCell>{provider.total_jobs}</TableCell>
                      <TableCell>${provider.total_earnings.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant={provider.is_active ? "default" : "destructive"}>
                            {provider.is_active ? "Active" : "Suspended"}
                          </Badge>
                          {provider.is_verified ? (
                            <Badge variant="default">Verified</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(provider.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedProvider(provider)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!provider.is_verified && (
                              <DropdownMenuItem
                                onClick={() => handleVerifyProvider(provider.id)}
                                disabled={verifyingProvider === provider.id}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                {verifyingProvider === provider.id ? "Verifying..." : "Verify"}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              {provider.is_active ? "Suspend" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Provider Details Dialog */}
        <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedProvider?.first_name} {selectedProvider?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedProvider && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {selectedProvider.first_name} {selectedProvider.last_name}
                      </div>
                      <div>
                        <strong>Email:</strong> {selectedProvider.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {selectedProvider.phone}
                      </div>
                      <div>
                        <strong>Address:</strong> {selectedProvider.address}, {selectedProvider.city}{" "}
                        {selectedProvider.zip}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Professional Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Service:</strong>{" "}
                        <span className="capitalize">{selectedProvider.service_category}</span>
                      </div>
                      <div>
                        <strong>Experience:</strong> {selectedProvider.experience_years} years
                      </div>
                      <div>
                        <strong>Service Area:</strong> {selectedProvider.service_area}
                      </div>
                      <div>
                        <strong>Rating:</strong> {selectedProvider.rating}/5 ({selectedProvider.total_jobs} jobs)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedProvider.bio}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{selectedProvider.total_jobs}</div>
                      <div className="text-xs text-muted-foreground">Total Jobs</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">${selectedProvider.total_earnings.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Earnings</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{selectedProvider.rating}</div>
                      <div className="text-xs text-muted-foreground">Average Rating</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2 pt-4">
                  {!selectedProvider.is_verified && (
                    <Button
                      onClick={() => handleVerifyProvider(selectedProvider.id)}
                      disabled={verifyingProvider === selectedProvider.id}
                    >
                      {verifyingProvider === selectedProvider.id ? "Verifying..." : "Verify Provider"}
                    </Button>
                  )}
                  <Button variant="outline">Send Message</Button>
                  <Button variant="destructive">{selectedProvider.is_active ? "Suspend" : "Activate"}</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  )
}
