import { type NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/services", "/login", "/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  // API routes that don't require authentication
  const publicApiRoutes = ["/api/auth/login", "/api/auth/register"]
  const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Check for session
  const session = await getSessionFromRequest(request)

  if (!session) {
    // Redirect to login for protected routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Return 401 for API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Role-based access control
  if (session) {
    // Admin routes
    if (pathname.startsWith("/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/client", request.url))
    }

    // Client dashboard routes
    if (pathname.startsWith("/dashboard/client") && session.role !== "client") {
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard/handyman", request.url))
      }
    }

    // Handyman dashboard routes
    if (pathname.startsWith("/dashboard/handyman") && session.role !== "handyman") {
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard/client", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
