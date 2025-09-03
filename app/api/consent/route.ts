import { NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import { requireAuth } from "@/lib/auth/context"

export async function GET(req: Request) {
  const user = await requireAuth(req).catch(() => null)
  const store = getStore()
  store.log("consent.list", { actor: user?.userId })
  return NextResponse.json({ items: store.consents })
}

export async function POST(req: Request) {
  const user = await requireAuth(req)
  const body = (await req.json().catch(() => ({}))) as {
    subjectId?: string
    purpose?: string
    scope?: string
    expiresAt?: string
  }
  const store = getStore()
  const c = store.createConsent({
    subjectId: body.subjectId || user.userId,
    purpose: body.purpose || "treatment",
    scope: body.scope || "terminology",
    expiresAt: body.expiresAt,
    actor: user.userId,
  })
  store.log("consent.create", { actor: user.userId, consentId: c.id })
  return NextResponse.json({ ok: true, consent: c })
}
