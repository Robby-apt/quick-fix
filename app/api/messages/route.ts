import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

const SendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  bookingId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = SendMessageSchema.parse(body)

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const message = db.createMessage({
      sender_id: profile.id,
      receiver_id: validatedData.receiverId,
      booking_id: validatedData.bookingId,
      content: validatedData.content,
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Send message error:", error)

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

    const { searchParams } = new URL(request.url)
    const otherPartyId = searchParams.get("with")

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (otherPartyId) {
      // Get conversation messages
      const messages = db.getConversationMessages(profile.id, otherPartyId)
      return NextResponse.json({ messages })
    } else {
      // Get all conversations
      const conversations = db.getUserConversations(profile.id)
      return NextResponse.json({ conversations })
    }
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
