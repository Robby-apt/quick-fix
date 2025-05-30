import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = db.getDashboardStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
