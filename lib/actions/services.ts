"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Validation schemas
export const ServiceSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  priceType: z.enum(["hourly", "fixed"]),
  basePrice: z
    .string()
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
})

// Form state types
export type ServiceFormState = {
  errors?: {
    title?: string[]
    description?: string[]
    category?: string[]
    priceType?: string[]
    basePrice?: string[]
    _form?: string[]
  }
  message?: string
}

// Create service action
export async function createService(prevState: ServiceFormState, formData: FormData) {
  // Validate form data
  const validatedFields = ServiceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    priceType: formData.get("priceType"),
    basePrice: formData.get("basePrice"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid service data. Please check the fields.",
    }
  }

  const { title, description, category, priceType, basePrice } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        errors: {
          _form: ["You must be logged in to create a service."],
        },
      }
    }

    // Get handyman profile ID
    const { data: profileData } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

    if (!profileData) {
      return {
        errors: {
          _form: ["Handyman profile not found."],
        },
      }
    }

    // Create service
    const { error } = await supabase.from("services").insert({
      title,
      description,
      category,
      price_type: priceType,
      base_price: Number.parseFloat(basePrice),
      handyman_id: profileData.id,
    })

    if (error) {
      return {
        errors: {
          _form: [error.message || "Failed to create service. Please try again."],
        },
      }
    }

    // Revalidate services page
    revalidatePath("/dashboard/handyman/services")

    // Redirect to services page
    redirect("/dashboard/handyman/services")
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Get service categories
export async function getServiceCategories() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("service_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching service categories:", error)
    return []
  }

  return data || []
}

// Get services by handyman
export async function getHandymanServices(handymanId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("handyman_id", handymanId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching handyman services:", error)
    return []
  }

  return data || []
}

// Get services by category
export async function getServicesByCategory(category: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      profiles:handyman_id (
        first_name,
        last_name,
        profile_image,
        handyman_profiles (
          experience_years,
          is_verified
        )
      )
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching services by category:", error)
    return []
  }

  return data || []
}

// Search services
export async function searchServices(query: string, category?: string) {
  const supabase = createServerSupabaseClient()

  let queryBuilder = supabase
    .from("services")
    .select(`
      *,
      profiles:handyman_id (
        first_name,
        last_name,
        profile_image,
        handyman_profiles (
          experience_years,
          is_verified
        )
      )
    `)
    .ilike("title", `%${query}%`)

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching services:", error)
    return []
  }

  return data || []
}
