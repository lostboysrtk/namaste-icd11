import { type NextRequest, NextResponse } from "next/server"
import { icd11Search } from "@/lib/integrations/icd11"
import { getStore } from "@/lib/terminology/store"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const items = q ? await icd11Search(q) : []
  // audit
  getStore().log("icd11.search", { q, count: items.length, live: Boolean(process.env.ICD11_API_TOKEN) })
  return NextResponse.json({ items })
}
