import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db/database"
import { createSession } from "@/lib/auth/session"

const HandymanSignupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().min(5),
  serviceCategory: z.string().min(1),
  experience: z.string().min(1),
  serviceArea: z.string().min(1),
  bio: z.string().min(20),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = HandymanSignupSchema.parse(body)

    // Check if user already exists
    const existingUser = db.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create user
    const user = await db.createUser(validatedData.email, validatedData.password, "handyman")

    // Create profile
    const profile = db.createProfile({
      user_id: user.id,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      zip: validatedData.zip,
      bio: validatedData.bio,
    })

    // Create handyman profile
    const handymanProfile = db.createHandymanProfile({
      id: profile.id,
      service_category: validatedData.serviceCategory,
      experience_years: Number.parseInt(validatedData.experience),
      service_area: Number.parseInt(validatedData.serviceArea),
      is_verified: false,
    })

    // Create session
    await createSession(user.id, user.email, user.role)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: profile,
        handymanProfile: handymanProfile,
      },
    })
  } catch (error) {
    console.error("Handyman registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
