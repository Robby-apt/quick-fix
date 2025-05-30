import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  role: "client" | "handyman" | "admin"
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload as SessionPayload
}

export async function createSession(userId: string, email: string, role: "client" | "handyman" | "admin") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ userId, email, role, expiresAt })

  cookies().set("session", session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function verifySession() {
  const cookie = cookies().get("session")?.value
  if (!cookie) return null

  try {
    const session = await decrypt(cookie)
    return session
  } catch (error) {
    return null
  }
}

export function deleteSession() {
  cookies().delete("session")
}

export async function getSessionFromRequest(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value
  if (!cookie) return null

  try {
    const session = await decrypt(cookie)
    return session
  } catch (error) {
    return null
  }
}
