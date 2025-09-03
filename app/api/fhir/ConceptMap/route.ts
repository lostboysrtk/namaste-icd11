// Minimal ConceptMap listing endpoint for inspection
import { NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"

export async function GET() {
  const store = getStore()
  return NextResponse.json({
    resourceType: "Bundle",
    type: "collection",
    entry: store.conceptMaps.map((cm) => ({ resource: cm })),
  })
}
