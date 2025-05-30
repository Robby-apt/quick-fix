"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MessageSquare, Search, Star, PenToolIcon as Tool, User } from "lucide-react"
import ClientDashboardLayout from "@/components/layouts/client-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useBookings } from "@/lib/hooks/useBookings"
import { useServices } from "@/lib/hooks/useServices"
import { useState } from "react"

export default function ClientDashboardPage() {
  const { user } = useAuth()
  const { bookings, loading: bookingsLoading, updateBookingStatus } = useBookings()
  const { services } = useServices()
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null)

  // Filter bookings
  const upcomingBookings = bookings.filter((booking) => booking.status === "pending" || booking.status === "confirmed")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")

  // Get recommended services (sample logic)
  const recommendedServices = services.slice(0, 3)

  const handleBookingAction = async (bookingId: string, action: "cancel" | "reschedule") => {
    if (action === "cancel") {
      try {
        setUpdatingBooking(bookingId)
        await updateBookingStatus(bookingId, "cancelled")
      } catch (error) {
        console.error("Failed to cancel booking:", error)
      } finally {
        setUpdatingBooking(null)
      }
    } else {
      // For reschedule, you might want to open a modal or navigate to a reschedule page
      console.log("Reschedule booking:", bookingId)
    }
  }

  if (!user) {
    return (
      <ClientDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
          </div>
        </div>
      </ClientDashboardLayout>
    )
  }

  return (
    <ClientDashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.profile.first_name}!</h1>
          <p className="text-muted-foreground">Manage your bookings and find new services</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Find Services</h3>
              <p className="text-sm text-muted-foreground mb-4">Search for handymen in your area</p>
              <Button className="w-full" asChild>
                <a href="/services">Browse Services</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Schedule Service</h3>
              <p className="text-sm text-muted-foreground mb-4">Book an appointment with a professional</p>
              <Button className="w-full" asChild>
                <a href="/services">Book Now</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get help with your account or services</p>
              <Button className="w-full" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appointments and History */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled services with handymen</CardDescription>
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
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          <h3 className="font-medium">{booking.service_title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            {booking.handyman_first_name} {booking.handyman_last_name}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {booking.time_slot}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.address}, {booking.city}
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBookingAction(booking.id, "reschedule")}
                              disabled={updatingBooking === booking.id}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBookingAction(booking.id, "cancel")}
                              disabled={updatingBooking === booking.id}
                            >
                              {updatingBooking === booking.id ? "Cancelling..." : "Cancel"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming appointments</p>
                    <Button className="mt-4" asChild>
                      <a href="/services">Book a Service</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Your past services and completed appointments</CardDescription>
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
                            {booking.handyman_first_name} {booking.handyman_last_name}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.address}, {booking.city}
                          </div>
                          <div className="text-sm font-medium text-green-600">${booking.price.toFixed(2)}</div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="secondary">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No service history yet</p>
                    <Button className="mt-4" asChild>
                      <a href="/services">Book Your First Service</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommended Services */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Services</CardTitle>
            <CardDescription>Popular services in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <Tool className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.first_name} {service.last_name}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm">4.8</span>
                        </div>
                        <div className="text-sm font-medium">
                          ${service.base_price}/{service.price_type === "hourly" ? "hr" : "job"}
                        </div>
                      </div>
                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No services available at the moment</p>
                <Button className="mt-4" asChild>
                  <a href="/services">Browse All Services</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  )
}
