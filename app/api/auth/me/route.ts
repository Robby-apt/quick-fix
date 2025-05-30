import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = db.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const profile = db.getProfileByUserId(user.id)
    let handymanProfile = null

    if (user.role === "handyman" && profile) {
      handymanProfile = db.getHandymanProfileById(profile.id)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: profile,
        handymanProfile: handymanProfile,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
