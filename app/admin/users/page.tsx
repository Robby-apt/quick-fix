"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, UserCheck, UserX, Eye, Mail } from "lucide-react"
import AdminDashboardLayout from "@/components/layouts/admin-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useState, useEffect, useMemo } from "react"
import { apiClient } from "@/lib/api/client"

interface User {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  zip: string
  created_at: string
  is_active: boolean
  service_category?: string
  experience_years?: number
  is_verified?: boolean
  last_login?: string
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<"suspend" | "activate" | "verify" | null>(null)
  const [processingAction, setProcessingAction] = useState(false)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockUsers: User[] = [
          {
            id: "1",
            email: "john.doe@example.com",
            role: "client",
            first_name: "John",
            last_name: "Doe",
            phone: "+1 (555) 123-4567",
            address: "123 Main St",
            city: "New York",
            zip: "10001",
            created_at: "2024-03-10T00:00:00Z",
            is_active: true,
            last_login: "2024-03-15T10:30:00Z",
          },
          {
            id: "2",
            email: "mike.smith@example.com",
            role: "handyman",
            first_name: "Mike",
            last_name: "Smith",
            phone: "+1 (555) 234-5678",
            address: "456 Oak Ave",
            city: "New York",
            zip: "10002",
            created_at: "2024-03-12T00:00:00Z",
            is_active: true,
            service_category: "plumbing",
            experience_years: 15,
            is_verified: true,
            last_login: "2024-03-15T09:15:00Z",
          },
          {
            id: "3",
            email: "sarah.johnson@example.com",
            role: "client",
            first_name: "Sarah",
            last_name: "Johnson",
            phone: "+1 (555) 345-6789",
            address: "789 Pine St",
            city: "Brooklyn",
            zip: "11201",
            created_at: "2024-03-08T00:00:00Z",
            is_active: true,
            last_login: "2024-03-14T16:45:00Z",
          },
          {
            id: "4",
            email: "david.wilson@example.com",
            role: "handyman",
            first_name: "David",
            last_name: "Wilson",
            phone: "+1 (555) 456-7890",
            address: "321 Elm St",
            city: "Queens",
            zip: "11101",
            created_at: "2024-03-07T00:00:00Z",
            is_active: true,
            service_category: "electrical",
            experience_years: 8,
            is_verified: false,
            last_login: "2024-03-13T14:20:00Z",
          },
          {
            id: "5",
            email: "emily.davis@example.com",
            role: "client",
            first_name: "Emily",
            last_name: "Davis",
            phone: "+1 (555) 567-8901",
            address: "654 Maple Ave",
            city: "Manhattan",
            zip: "10003",
            created_at: "2024-02-28T00:00:00Z",
            is_active: false,
            last_login: "2024-03-01T11:30:00Z",
          },
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users

    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery),
    )
  }, [users, searchQuery])

  const clients = filteredUsers.filter((user) => user.role === "client")
  const handymen = filteredUsers.filter((user) => user.role === "handyman")

  const handleUserAction = async () => {
    if (!selectedUser || !actionType) return

    setProcessingAction(true)
    try {
      switch (actionType) {
        case "suspend":
          // await apiClient.suspendUser(selectedUser.id)
          setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, is_active: false } : user)))
          break
        case "activate":
          // await apiClient.activateUser(selectedUser.id)
          setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, is_active: true } : user)))
          break
        case "verify":
          await apiClient.verifyHandyman(selectedUser.id)
          setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, is_verified: true } : user)))
          break
      }
    } catch (error) {
      console.error(`Failed to ${actionType} user:`, error)
    } finally {
      setProcessingAction(false)
      setSelectedUser(null)
      setActionType(null)
    }
  }

  const openActionDialog = (user: User, action: "suspend" | "activate" | "verify") => {
    setSelectedUser(user)
    setActionType(action)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage clients and service providers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
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
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{handymen.length}</div>
              <p className="text-xs text-muted-foreground">Service Providers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{users.filter((u) => !u.is_active).length}</div>
              <p className="text-xs text-muted-foreground">Suspended Users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
            <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
            <TabsTrigger value="handymen">Service Providers ({handymen.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable users={filteredUsers} onAction={openActionDialog} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>Users who book services</CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable users={clients} onAction={openActionDialog} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="handymen">
            <Card>
              <CardHeader>
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>Handymen offering services</CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable users={handymen} onAction={openActionDialog} loading={loading} showHandymanColumns />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <AlertDialog
          open={!!selectedUser && !!actionType}
          onOpenChange={() => {
            setSelectedUser(null)
            setActionType(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === "suspend" && "Suspend User"}
                {actionType === "activate" && "Activate User"}
                {actionType === "verify" && "Verify Handyman"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === "suspend" &&
                  `Are you sure you want to suspend ${selectedUser?.first_name} ${selectedUser?.last_name}? They will not be able to access the platform.`}
                {actionType === "activate" &&
                  `Are you sure you want to activate ${selectedUser?.first_name} ${selectedUser?.last_name}? They will regain access to the platform.`}
                {actionType === "verify" &&
                  `Are you sure you want to verify ${selectedUser?.first_name} ${selectedUser?.last_name} as a service provider? This will mark them as a trusted professional.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUserAction} disabled={processingAction}>
                {processingAction ? "Processing..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminDashboardLayout>
  )
}

interface UserTableProps {
  users: User[]
  onAction: (user: User, action: "suspend" | "activate" | "verify") => void
  loading: boolean
  showHandymanColumns?: boolean
}

function UserTable({ users, onAction, loading, showHandymanColumns = false }: UserTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Location</TableHead>
          {showHandymanColumns && (
            <>
              <TableHead>Service</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Verified</TableHead>
            </>
          )}
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.first_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>
              {user.city}, {user.zip}
            </TableCell>
            {showHandymanColumns && (
              <>
                <TableCell className="capitalize">{user.service_category}</TableCell>
                <TableCell>{user.experience_years} years</TableCell>
                <TableCell>
                  {user.is_verified ? (
                    <Badge variant="default">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
              </>
            )}
            <TableCell>
              <Badge variant={user.is_active ? "default" : "destructive"}>
                {user.is_active ? "Active" : "Suspended"}
              </Badge>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}</TableCell>
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
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === "handyman" && !user.is_verified && (
                    <DropdownMenuItem onClick={() => onAction(user, "verify")}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Verify
                    </DropdownMenuItem>
                  )}
                  {user.is_active ? (
                    <DropdownMenuItem onClick={() => onAction(user, "suspend")}>
                      <UserX className="mr-2 h-4 w-4" />
                      Suspend
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onAction(user, "activate")}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
