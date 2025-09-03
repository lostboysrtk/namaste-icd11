import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import type { Coding } from "@/lib/fhir/types"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    coding: Coding
    targetSystem: string
  }
  const store = getStore()
  const targets = store.translate(body.coding, body.targetSystem)
  // Return both simplified and FHIR-like for convenience
  return NextResponse.json({
    targets,
    parameters: {
      resourceType: "Parameters",
      parameter: [
        { name: "result", valueBoolean: targets.length > 0 },
        ...targets.map((t) => ({
          name: "match",
          part: [
            { name: "equivalence", valueCode: (t as any).equivalence || "relatedto" },
            {
              name: "concept",
              valueCoding: { system: body.targetSystem, code: t.code, display: t.display },
            },
          ],
        })),
      ],
    },
  })
}
