import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

const UpdateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = UpdateStatusSchema.parse(body)

    const booking = db.getBookingById(params.id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check permissions
    const isClient = profile.id === booking.client_id
    const isHandyman = profile.id === booking.handyman_id
    const isAdmin = session.role === "admin"

    if (!isClient && !isHandyman && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Apply business rules
    if (status === "confirmed" && !isHandyman && !isAdmin) {
      return NextResponse.json({ error: "Only handymen can confirm bookings" }, { status: 403 })
    }

    if (status === "completed" && !isHandyman && !isAdmin) {
      return NextResponse.json({ error: "Only handymen can mark bookings as completed" }, { status: 403 })
    }

    db.updateBookingStatus(params.id, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update booking status error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
