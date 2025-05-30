"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get all users
export async function getAllUsers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*, handyman_profiles(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

// Get all bookings
export async function getAllBookings() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        title,
        category
      ),
      client:client_id (
        first_name,
        last_name
      ),
      handyman:handyman_id (
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

// Verify handyman
export async function verifyHandyman(handymanId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to verify a handyman." }
    }

    // Get user role
    const { data: userData } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

    if (!userData || userData.role !== "admin") {
      return { success: false, message: "Only admins can verify handymen." }
    }

    // Update handyman verification status
    const { error } = await supabase.from("handyman_profiles").update({ is_verified: true }).eq("id", handymanId)

    if (error) {
      return { success: false, message: error.message || "Failed to verify handyman." }
    }

    // Revalidate admin pages
    revalidatePath("/admin/providers")

    return { success: true, message: "Handyman verified successfully." }
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

// Suspend user
export async function suspendUser(userId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to suspend a user." }
    }

    // Get user role
    const { data: userData } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

    if (!userData || userData.role !== "admin") {
      return { success: false, message: "Only admins can suspend users." }
    }

    // Disable user in auth
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { ban_duration: "87600h" }, // 10 years
    )

    if (error) {
      return { success: false, message: error.message || "Failed to suspend user." }
    }

    // Revalidate admin pages
    revalidatePath("/admin/users")
    revalidatePath("/admin/providers")

    return { success: true, message: "User suspended successfully." }
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  try {
    // Get total users count
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    // Get handymen count
    const { count: totalHandymen } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "handyman")

    // Get completed bookings count
    const { count: completedBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    // Get open support tickets (placeholder - would need a support_tickets table)
    const openTickets = 0

    return {
      totalUsers: totalUsers || 0,
      totalHandymen: totalHandymen || 0,
      completedBookings: completedBookings || 0,
      openTickets,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalUsers: 0,
      totalHandymen: 0,
      completedBookings: 0,
      openTickets: 0,
    }
  }
}
