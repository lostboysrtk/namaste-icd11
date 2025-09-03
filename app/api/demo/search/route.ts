import { NextResponse } from "next/server"
import { searchNamaste, searchIcd11 } from "@/lib/demo-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const includeICD = searchParams.get("icd") === "1"

  const namaste = searchNamaste(q)
  const icd = includeICD ? searchIcd11(q) : []

  return NextResponse.json({
    query: q,
    namaste,
    icd11: icd,
  })
}
