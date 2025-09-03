import { type NextRequest, NextResponse } from "next/server"
import type { Bundle } from "@/lib/fhir/types"
import { getStore } from "@/lib/terminology/store"
import { getAuthContextFromRequest } from "@/lib/auth/context"

export async function POST(req: NextRequest) {
  const store = getStore()
  const user = await getAuthContextFromRequest(req)
  const payload = (await req.json().catch(() => ({}))) as Bundle
  if (payload?.resourceType !== "Bundle") {
    store.log("fhir.bundle.invalid", { reason: "not Bundle", actor: user?.userId })
    return NextResponse.json({ ok: false, error: "Invalid resourceType, expected Bundle" }, { status: 400 })
  }
  const count = payload.entry?.length || 0
  store.log("fhir.bundle.accepted", { entries: count, type: payload.type, actor: user?.userId })
  return NextResponse.json({ ok: true, entries: count, type: payload.type })
}
