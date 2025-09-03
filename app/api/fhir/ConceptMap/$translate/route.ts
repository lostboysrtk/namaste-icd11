// Implements FHIR ConceptMap $translate operation
import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import { getAuthContextFromRequest } from "@/lib/auth/context"

type Coding = { system: string; code: string; display?: string }

function parseBody(body: any): { coding?: Coding; targetSystem?: string } {
  if (!body) return {}
  // Simplified JSON
  if (body.coding && body.targetSystem) return { coding: body.coding, targetSystem: body.targetSystem }

  // FHIR Parameters
  if (body.resourceType === "Parameters" && Array.isArray(body.parameter)) {
    const out: { coding?: Coding; targetSystem?: string } = {}
    let code: string | undefined
    let system: string | undefined
    for (const p of body.parameter) {
      if (p.name === "coding" && p.valueCoding) {
        out.coding = {
          system: p.valueCoding.system,
          code: p.valueCoding.code,
          display: p.valueCoding.display,
        }
      } else if (p.name === "code" && p.valueCode) {
        code = p.valueCode
      } else if (p.name === "system" && p.valueUri) {
        system = p.valueUri
      } else if (p.name === "targetsystem" && p.valueUri) {
        out.targetSystem = p.valueUri
      }
    }
    if (!out.coding && code && system) out.coding = { code, system }
    return out
  }
  return {}
}

export async function POST(req: NextRequest) {
  const user = await getAuthContextFromRequest(req)
  const body = await req.json().catch(() => ({}))
  const { coding, targetSystem } = parseBody(body)
  if (!coding?.code || !coding?.system || !targetSystem) {
    return NextResponse.json(
      { issue: [{ severity: "error", details: { text: "Missing coding {system,code} or targetSystem" } }] },
      { status: 400 },
    )
  }

  const store = getStore()
  const targets = store.translate(coding, targetSystem)
  store.log("fhir.conceptmap.translate", { from: coding, toSystem: targetSystem, actor: user?.userId })

  return NextResponse.json({
    resourceType: "Parameters",
    parameter: [
      { name: "result", valueBoolean: targets.length > 0 },
      ...targets.map((t: any) => ({
        name: "match",
        part: [
          { name: "equivalence", valueCode: t.equivalence || "relatedto" },
          { name: "concept", valueCoding: { system: targetSystem, code: t.code, display: t.display } },
        ],
      })),
    ],
  })
}
