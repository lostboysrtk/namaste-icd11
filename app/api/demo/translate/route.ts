import { NextResponse } from "next/server"
import { mapNamasteToIcd11 } from "@/lib/demo-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code") || ""
  const targets = mapNamasteToIcd11(code)
  return NextResponse.json({
    source: { system: "NAMASTE", code },
    targets,
  })
}
