import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string(),
  timeSlot: z.string(),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().min(5),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateBookingSchema.parse(body)

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const service = db.getServiceById(validatedData.serviceId)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const booking = db.createBooking({
      client_id: profile.id,
      handyman_id: service.handyman_id,
      service_id: validatedData.serviceId,
      date: validatedData.date,
      time_slot: validatedData.timeSlot,
      address: validatedData.address,
      city: validatedData.city,
      zip: validatedData.zip,
      notes: validatedData.notes,
      price: service.base_price,
    })

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Create booking error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    let bookings
    if (session.role === "client") {
      bookings = db.getClientBookings(profile.id)
    } else if (session.role === "handyman") {
      bookings = db.getHandymanBookings(profile.id)
    } else {
      bookings = db.getAllBookings()
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
