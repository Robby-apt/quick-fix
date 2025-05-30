"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"

interface Booking {
  id: string
  client_id: string
  handyman_id: string
  service_id: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  date: string
  time_slot: string
  address: string
  city: string
  zip: string
  notes?: string
  price: number
  service_title?: string
  service_description?: string
  service_category?: string
  client_first_name?: string
  client_last_name?: string
  client_image?: string
  handyman_first_name?: string
  handyman_last_name?: string
  handyman_image?: string
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getBookings()
      setBookings(response.bookings)
    } catch (error) {
      setError("Failed to fetch bookings")
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (data: {
    serviceId: string
    date: string
    timeSlot: string
    address: string
    city: string
    zip: string
    notes?: string
  }) => {
    try {
      const response = await apiClient.createBooking(data)
      await fetchBookings() // Refresh the list
      return response
    } catch (error) {
      throw error
    }
  }

  const updateBookingStatus = async (
    bookingId: string,
    status: "pending" | "confirmed" | "completed" | "cancelled",
  ) => {
    try {
      await apiClient.updateBookingStatus(bookingId, status)
      await fetchBookings() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings,
  }
}
