import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"

export async function GET() {
  const store = getStore()
  return NextResponse.json({ audit: store.audit })
}

export async function POST(req: NextRequest) {
  const store = getStore()
  const body = await req.json().catch(() => ({}))
  store.log("client.audit", body)
  return NextResponse.json({ ok: true })
}
