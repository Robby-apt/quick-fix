"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"

// Validation schemas
export const ClientSignupSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    zip: z.string().min(5, { message: "ZIP code is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const HandymanSignupSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    zip: z.string().min(5, { message: "ZIP code is required" }),
    serviceCategory: z.string().min(1, { message: "Please select a service category" }),
    experience: z.string().min(1, { message: "Please select years of experience" }),
    serviceArea: z.string().min(1, { message: "Please select a service area" }),
    bio: z.string().min(20, { message: "Bio must be at least 20 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

// Form state types
export type ClientSignupFormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
    city?: string[]
    zip?: string[]
    password?: string[]
    confirmPassword?: string[]
    terms?: string[]
    _form?: string[]
  }
  message?: string
}

export type HandymanSignupFormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
    city?: string[]
    zip?: string[]
    serviceCategory?: string[]
    experience?: string[]
    serviceArea?: string[]
    bio?: string[]
    password?: string[]
    confirmPassword?: string[]
    terms?: string[]
    _form?: string[]
  }
  message?: string
}

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  message?: string
}

// Client signup action
export async function clientSignup(prevState: ClientSignupFormState, formData: FormData) {
  // Validate form data
  const validatedFields = ClientSignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create account.",
    }
  }

  const { firstName, lastName, email, phone, address, city, zip, password } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "client",
        },
      },
    })

    if (authError || !authData.user) {
      return {
        errors: {
          _form: [authError?.message || "Failed to create account. Please try again."],
        },
      }
    }

    // Create profile in database
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      role: "client",
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      city,
      zip,
    })

    if (profileError) {
      // Attempt to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return {
        errors: {
          _form: [profileError.message || "Failed to create profile. Please try again."],
        },
      }
    }

    // Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return {
        errors: {
          _form: [signInError.message || "Account created but failed to sign in. Please log in."],
        },
      }
    }

    // Redirect to client dashboard
    redirect("/dashboard/client")
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Handyman signup action
export async function handymanSignup(prevState: HandymanSignupFormState, formData: FormData) {
  // Validate form data
  const validatedFields = HandymanSignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    serviceCategory: formData.get("serviceCategory"),
    experience: formData.get("experience"),
    serviceArea: formData.get("serviceArea"),
    bio: formData.get("bio"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create account.",
    }
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    zip,
    serviceCategory,
    experience,
    serviceArea,
    bio,
    password,
  } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "handyman",
        },
      },
    })

    if (authError || !authData.user) {
      return {
        errors: {
          _form: [authError?.message || "Failed to create account. Please try again."],
        },
      }
    }

    // Create profile in database
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        role: "handyman",
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        city,
        zip,
        bio,
      })
      .select("id")
      .single()

    if (profileError || !profileData) {
      // Attempt to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return {
        errors: {
          _form: [profileError?.message || "Failed to create profile. Please try again."],
        },
      }
    }

    // Create handyman profile
    const { error: handymanProfileError } = await supabase.from("handyman_profiles").insert({
      id: profileData.id,
      service_category: serviceCategory,
      experience_years: Number.parseInt(experience),
      service_area: Number.parseInt(serviceArea),
      is_verified: false,
    })

    if (handymanProfileError) {
      // Attempt to clean up if handyman profile creation fails
      await supabase.from("profiles").delete().eq("id", profileData.id)
      await supabase.auth.admin.deleteUser(authData.user.id)

      return {
        errors: {
          _form: [handymanProfileError.message || "Failed to create handyman profile. Please try again."],
        },
      }
    }

    // Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return {
        errors: {
          _form: [signInError.message || "Account created but failed to sign in. Please log in."],
        },
      }
    }

    // Redirect to handyman dashboard
    redirect("/dashboard/handyman")
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Login action
export async function login(prevState: LoginFormState, formData: FormData) {
  // Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid email or password.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return {
        errors: {
          _form: [error?.message || "Invalid email or password."],
        },
      }
    }

    // Get user role
    const { data: userData } = await supabase.from("profiles").select("role").eq("user_id", data.user.id).single()

    // Redirect based on user role
    if (userData?.role === "client") {
      redirect("/dashboard/client")
    } else if (userData?.role === "handyman") {
      redirect("/dashboard/handyman")
    } else if (userData?.role === "admin") {
      redirect("/admin")
    } else {
      // Default fallback
      redirect("/dashboard/client")
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Logout action
export async function logout() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()

  // Clear cookies
  cookies().delete("sb-access-token")
  cookies().delete("sb-refresh-token")

  redirect("/")
}

// Check auth status
export async function checkAuthStatus() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { isAuthenticated: !!session }
}

// Get current user
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase.from("profiles").select("*, handyman_profiles(*)").eq("user_id", user.id).single()

  return data
}
