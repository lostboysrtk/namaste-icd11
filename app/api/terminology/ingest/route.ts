import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import { requireAuth } from "@/lib/auth/context"

export async function POST(req: NextRequest) {
  const store = getStore()
  const user = await requireAuth(req).catch(() => null)
  const contentType = req.headers.get("content-type") || ""
  let csv = ""
  let systemUrl: string | undefined

  if (contentType.includes("text/csv")) {
    csv = await req.text()
  } else {
    const body = await req.json().catch(() => ({}) as any)
    csv = body.csv || ""
    systemUrl = body.systemUrl
  }

  if (!csv.trim()) {
    return NextResponse.json({ ok: false, error: "Missing CSV content" }, { status: 400 })
  }

  const stats = store.ingestNamasteCsv(csv, { systemUrl })
  store.log("terminology.ingest", { actor: user?.userId, stats })
  return NextResponse.json({ ok: true, ...stats })
}
