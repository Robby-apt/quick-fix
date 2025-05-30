"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Validation schemas
export const BookingSchema = z.object({
  serviceId: z.string().uuid({ message: "Invalid service ID" }),
  date: z.string().refine(
    (val) => {
      const selectedDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    },
    { message: "Date must be today or in the future" },
  ),
  timeSlot: z.string().min(1, { message: "Time slot is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  zip: z.string().min(5, { message: "ZIP code is required" }),
  notes: z.string().optional(),
})

// Form state types
export type BookingFormState = {
  errors?: {
    serviceId?: string[]
    date?: string[]
    timeSlot?: string[]
    address?: string[]
    city?: string[]
    zip?: string[]
    notes?: string[]
    _form?: string[]
  }
  message?: string
}

// Create booking action
export async function createBooking(prevState: BookingFormState, formData: FormData) {
  // Validate form data
  const validatedFields = BookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    timeSlot: formData.get("timeSlot"),
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    notes: formData.get("notes"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid booking data. Please check the fields.",
    }
  }

  const { serviceId, date, timeSlot, address, city, zip, notes } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        errors: {
          _form: ["You must be logged in to create a booking."],
        },
      }
    }

    // Get client profile ID
    const { data: profileData } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

    if (!profileData) {
      return {
        errors: {
          _form: ["Client profile not found."],
        },
      }
    }

    // Get service details
    const { data: serviceData } = await supabase
      .from("services")
      .select("*, handyman_id, base_price")
      .eq("id", serviceId)
      .single()

    if (!serviceData) {
      return {
        errors: {
          _form: ["Service not found."],
        },
      }
    }

    // Create booking
    const { error } = await supabase.from("bookings").insert({
      client_id: profileData.id,
      handyman_id: serviceData.handyman_id,
      service_id: serviceId,
      status: "pending",
      date,
      time_slot: timeSlot,
      address,
      city,
      zip,
      notes,
      price: serviceData.base_price,
    })

    if (error) {
      return {
        errors: {
          _form: [error.message || "Failed to create booking. Please try again."],
        },
      }
    }

    // Revalidate bookings page
    revalidatePath("/dashboard/client/appointments")

    // Redirect to bookings page
    redirect("/dashboard/client/appointments")
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Update booking status action
export async function updateBookingStatus(bookingId: string, status: "confirmed" | "completed" | "cancelled") {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to update a booking." }
    }

    // Get user profile ID and role
    const { data: profileData } = await supabase.from("profiles").select("id, role").eq("user_id", user.id).single()

    if (!profileData) {
      return { success: false, message: "User profile not found." }
    }

    // Get booking details
    const { data: bookingData } = await supabase.from("bookings").select("*").eq("id", bookingId).single()

    if (!bookingData) {
      return { success: false, message: "Booking not found." }
    }

    // Check if user has permission to update this booking
    const isClient = profileData.id === bookingData.client_id
    const isHandyman = profileData.id === bookingData.handyman_id
    const isAdmin = profileData.role === "admin"

    if (!isClient && !isHandyman && !isAdmin) {
      return { success: false, message: "You do not have permission to update this booking." }
    }

    // Apply status update rules
    if (status === "confirmed" && !isHandyman && !isAdmin) {
      return { success: false, message: "Only handymen or admins can confirm bookings." }
    }

    if (status === "completed" && !isHandyman && !isAdmin) {
      return { success: false, message: "Only handymen or admins can mark bookings as completed." }
    }

    // Update booking status
    const { error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)

    if (error) {
      return { success: false, message: error.message || "Failed to update booking status." }
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/client/appointments")
    revalidatePath("/dashboard/handyman/appointments")
    revalidatePath(`/bookings/${bookingId}`)

    return { success: true, message: `Booking ${status} successfully.` }
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

// Get client bookings
export async function getClientBookings(clientId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        title,
        description,
        category,
        price_type,
        base_price
      ),
      handyman:handyman_id (
        first_name,
        last_name,
        profile_image
      )
    `)
    .eq("client_id", clientId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching client bookings:", error)
    return []
  }

  return data || []
}

// Get handyman bookings
export async function getHandymanBookings(handymanId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        title,
        description,
        category,
        price_type,
        base_price
      ),
      client:client_id (
        first_name,
        last_name,
        profile_image
      )
    `)
    .eq("handyman_id", handymanId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching handyman bookings:", error)
    return []
  }

  return data || []
}

// Get booking details
export async function getBookingDetails(bookingId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        title,
        description,
        category,
        price_type,
        base_price
      ),
      client:client_id (
        first_name,
        last_name,
        phone,
        profile_image
      ),
      handyman:handyman_id (
        first_name,
        last_name,
        phone,
        profile_image
      )
    `)
    .eq("id", bookingId)
    .single()

  if (error) {
    console.error("Error fetching booking details:", error)
    return null
  }

  return data
}
