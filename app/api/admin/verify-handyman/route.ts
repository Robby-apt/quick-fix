import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

const VerifyHandymanSchema = z.object({
  handymanId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { handymanId } = VerifyHandymanSchema.parse(body)

    db.verifyHandyman(handymanId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify handyman error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
