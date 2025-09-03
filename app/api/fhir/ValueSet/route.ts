// Optional: list available ValueSets for discovery
import { NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"

export async function GET() {
  const store = getStore()
  const list = Object.values(store.valueSets)
  return NextResponse.json({
    resourceType: "Bundle",
    type: "collection",
    entry: list.map((vs) => ({ resource: vs })),
  })
}
