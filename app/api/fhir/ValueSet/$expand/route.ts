// Implements FHIR ValueSet $expand operation
import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import { getAuthContextFromRequest } from "@/lib/auth/context"

// GET /api/fhir/ValueSet/$expand?url=<valueset-url-or-id>&filter=<text>
export async function GET(req: NextRequest) {
  const user = await getAuthContextFromRequest(req)
  const { searchParams } = new URL(req.url)
  const urlOrId = searchParams.get("url") || searchParams.get("id") || ""
  const filter = searchParams.get("filter") || ""
  if (!urlOrId) {
    return NextResponse.json(
      { issue: [{ severity: "error", details: { text: "Missing url or id" } }] },
      { status: 400 },
    )
  }
  const store = getStore()
  const expansion = store.expandValueSet(urlOrId)
  const contains = filter
    ? expansion.contains.filter(
        (c: any) =>
          c.code?.toLowerCase().includes(filter.toLowerCase()) ||
          (c.display || "").toLowerCase().includes(filter.toLowerCase()),
      )
    : expansion.contains
  store.log("fhir.valueset.expand", { urlOrId, filter, actor: user?.userId })
  return NextResponse.json({ resourceType: "ValueSet", expansion: { contains } })
}

// POST /api/fhir/ValueSet/$expand
// Accepts either { urlOrId, filter } JSON or FHIR Parameters with url + filter.
export async function POST(req: NextRequest) {
  const user = await getAuthContextFromRequest(req)
  const body = await req.json().catch(() => ({}) as any)
  let urlOrId = body.urlOrId || body.url || ""
  let filter = body.filter || ""
  if (body.resourceType === "Parameters" && Array.isArray(body.parameter)) {
    for (const p of body.parameter) {
      if (p.name === "url" && p.valueUri) urlOrId = p.valueUri
      if (p.name === "filter" && p.valueString) filter = p.valueString
    }
  }
  if (!urlOrId) {
    return NextResponse.json({ issue: [{ severity: "error", details: { text: "Missing url" } }] }, { status: 400 })
  }
  const store = getStore()
  const expansion = store.expandValueSet(urlOrId)
  const contains = filter
    ? expansion.contains.filter(
        (c: any) =>
          c.code?.toLowerCase().includes(filter.toLowerCase()) ||
          (c.display || "").toLowerCase().includes(filter.toLowerCase()),
      )
    : expansion.contains
  store.log("fhir.valueset.expand", { urlOrId, filter, actor: user?.userId })
  return NextResponse.json({ resourceType: "ValueSet", expansion: { contains } })
}
