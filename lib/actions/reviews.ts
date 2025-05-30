"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Validation schemas
export const ReviewSchema = z.object({
  bookingId: z.string().uuid({ message: "Invalid booking ID" }),
  rating: z.string().refine(
    (val) => {
      const rating = Number.parseInt(val)
      return !isNaN(rating) && rating >= 1 && rating <= 5
    },
    { message: "Rating must be between 1 and 5" },
  ),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }),
})

// Form state types
export type ReviewFormState = {
  errors?: {
    bookingId?: string[]
    rating?: string[]
    comment?: string[]
    _form?: string[]
  }
  message?: string
}

// Create review action
export async function createReview(prevState: ReviewFormState, formData: FormData) {
  // Validate form data
  const validatedFields = ReviewSchema.safeParse({
    bookingId: formData.get("bookingId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid review data. Please check the fields.",
    }
  }

  const { bookingId, rating, comment } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        errors: {
          _form: ["You must be logged in to create a review."],
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

    // Get booking details
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("client_id, handyman_id, status")
      .eq("id", bookingId)
      .single()

    if (!bookingData) {
      return {
        errors: {
          _form: ["Booking not found."],
        },
      }
    }

    // Check if user is the client who made the booking
    if (bookingData.client_id !== profileData.id) {
      return {
        errors: {
          _form: ["You can only review bookings you have made."],
        },
      }
    }

    // Check if booking is completed
    if (bookingData.status !== "completed") {
      return {
        errors: {
          _form: ["You can only review completed bookings."],
        },
      }
    }

    // Check if review already exists
    const { data: existingReview } = await supabase.from("reviews").select("id").eq("booking_id", bookingId).single()

    if (existingReview) {
      return {
        errors: {
          _form: ["You have already reviewed this booking."],
        },
      }
    }

    // Create review
    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      client_id: profileData.id,
      handyman_id: bookingData.handyman_id,
      rating: Number.parseInt(rating),
      comment,
    })

    if (error) {
      return {
        errors: {
          _form: [error.message || "Failed to create review. Please try again."],
        },
      }
    }

    // Revalidate paths
    revalidatePath("/dashboard/client/appointments")
    revalidatePath(`/bookings/${bookingId}`)

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

// Get handyman reviews
export async function getHandymanReviews(handymanId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      client:client_id (
        first_name,
        last_name,
        profile_image
      ),
      booking:booking_id (
        date,
        services (
          title,
          category
        )
      )
    `)
    .eq("handyman_id", handymanId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching handyman reviews:", error)
    return []
  }

  return data || []
}

// Get handyman average rating
export async function getHandymanRating(handymanId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("reviews").select("rating").eq("handyman_id", handymanId)

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 }
  }

  const total = data.reduce((sum, review) => sum + review.rating, 0)
  const average = total / data.length

  return { average, count: data.length }
}
