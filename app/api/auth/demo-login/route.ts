import { NextResponse } from "next/server"
import { issueToken } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { userId?: string; role?: string; name?: string; ttl?: number }
  const userId = body.userId || "user-001"
  const role = (body.role as any) || "clinician"
  const name = body.name || "Demo Clinician"
  const ttl = typeof body.ttl === "number" ? body.ttl : 3600
  const token = await issueToken({ sub: userId, role, name }, ttl)
  return NextResponse.json({ token, user: { id: userId, role, name }, expiresIn: ttl })
}
