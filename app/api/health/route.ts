import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "namaste-icd11-terminology",
    timestamp: new Date().toISOString(),
  })
}
