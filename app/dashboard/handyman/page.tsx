"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, MapPin, MessageSquare, Star, User } from "lucide-react"
import HandymanDashboardLayout from "@/components/layouts/handyman-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useBookings } from "@/lib/hooks/useBookings"
import { useServices } from "@/lib/hooks/useServices"
import { useState, useMemo } from "react"

export default function HandymanDashboardPage() {
  const { user } = useAuth()
  const { bookings, loading: bookingsLoading, updateBookingStatus } = useBookings()
  const { services } = useServices({ handyman: user?.profile.id })
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null)

  // Filter bookings
  const upcomingBookings = bookings.filter((booking) => booking.status === "pending" || booking.status === "confirmed")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const pendingBookings = bookings.filter((booking) => booking.status === "pending")

  // Calculate stats
  const stats = useMemo(() => {
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.price, 0)
    const completedThisMonth = completedBookings.filter(
      (booking) => new Date(booking.date).getMonth() === new Date().getMonth(),
    ).length

    return {
      totalEarnings,
      completedJobs: completedBookings.length,
      completedThisMonth,
      averageRating: 4.8, // This would come from reviews in a real app
      newRequests: pendingBookings.length,
    }
  }, [completedBookings, pendingBookings])

  const handleBookingAction = async (bookingId: string, action: "accept" | "decline" | "complete" | "cancel") => {
    try {
      setUpdatingBooking(bookingId)

      switch (action) {
        case "accept":
          await updateBookingStatus(bookingId, "confirmed")
          break
        case "decline":
        case "cancel":
          await updateBookingStatus(bookingId, "cancelled")
          break
        case "complete":
          await updateBookingStatus(bookingId, "completed")
          break
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error)
    } finally {
      setUpdatingBooking(null)
    }
  }

  if (!user) {
    return (
      <HandymanDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
          </div>
        </div>
      </HandymanDashboardLayout>
    )
  }

  return (
    <HandymanDashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.profile.first_name}!</h1>
          <p className="text-muted-foreground">
            {user.handymanProfile?.is_verified ? (
              <span className="text-green-600">✓ Verified Professional</span>
            ) : (
              <span className="text-yellow-600">⏳ Verification Pending</span>
            )}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">${stats.totalEarnings.toFixed(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">All time</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats.completedThisMonth}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold">{stats.averageRating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">From {stats.completedJobs} reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">New Requests</p>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats.newRequests}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Awaiting response</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments and History */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="history">Job History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled services with clients</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          <h3 className="font-medium">{booking.service_title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            {booking.client_first_name} {booking.client_last_name}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.address}, {booking.city}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {booking.time_slot}
                          </div>
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />${booking.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              Contact Client
                            </Button>
                            {booking.status === "confirmed" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleBookingAction(booking.id, "complete")}
                                  disabled={updatingBooking === booking.id}
                                >
                                  {updatingBooking === booking.id ? "Completing..." : "Mark Complete"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBookingAction(booking.id, "cancel")}
                                  disabled={updatingBooking === booking.id}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleBookingAction(booking.id, "accept")}
                                  disabled={updatingBooking === booking.id}
                                >
                                  {updatingBooking === booking.id ? "Accepting..." : "Accept"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBookingAction(booking.id, "decline")}
                                  disabled={updatingBooking === booking.id}
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Job History</CardTitle>
                <CardDescription>Your past services and completed jobs</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : completedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          <h3 className="font-medium">{booking.service_title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            {booking.client_first_name} {booking.client_last_name}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.address}, {booking.city}
                          </div>
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />${booking.price.toFixed(2)}
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No job history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Service Requests */}
        {pendingBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>New Service Requests</CardTitle>
              <CardDescription>Requests from clients in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBookings.map((request) => (
                  <div key={request.id} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{request.service_title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          {request.client_first_name} {request.client_last_name}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {request.address}, {request.city}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(request.date).toLocaleDateString()}, {request.time_slot}
                        </div>
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />${request.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:items-end">
                        <Button
                          size="sm"
                          onClick={() => handleBookingAction(request.id, "accept")}
                          disabled={updatingBooking === request.id}
                        >
                          {updatingBooking === request.id ? "Accepting..." : "Accept"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBookingAction(request.id, "decline")}
                          disabled={updatingBooking === request.id}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                    {request.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Services */}
        <Card>
          <CardHeader>
            <CardTitle>My Services</CardTitle>
            <CardDescription>Services you offer to clients</CardDescription>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          ${service.base_price}/{service.price_type === "hourly" ? "hr" : "job"}
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't created any services yet</p>
                <Button className="mt-4">Add Your First Service</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </HandymanDashboardLayout>
  )
}
