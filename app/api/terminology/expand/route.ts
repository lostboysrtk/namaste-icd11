import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { urlOrId } = body as { urlOrId: string }
  const store = getStore()
  const expansion = store.expandValueSet(urlOrId)
  return NextResponse.json({ expansion })
}
