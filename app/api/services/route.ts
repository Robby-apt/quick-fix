import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifySession } from "@/lib/auth/session"
import { db } from "@/lib/db/database"

const CreateServiceSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string().min(1),
  priceType: z.enum(["hourly", "fixed"]),
  basePrice: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "handyman") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateServiceSchema.parse(body)

    const profile = db.getProfileByUserId(session.userId)
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const service = db.createService({
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      price_type: validatedData.priceType,
      base_price: validatedData.basePrice,
      handyman_id: profile.id,
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error("Create service error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("q")
    const handymanId = searchParams.get("handyman")

    let services

    if (handymanId) {
      services = db.getServicesByHandyman(handymanId)
    } else if (query) {
      services = db.searchServices(query, category || undefined)
    } else if (category) {
      services = db.getServicesByCategory(category)
    } else {
      // Get all services with handyman info
      services = db.searchServices("", undefined)
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Get services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
