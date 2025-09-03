"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { ProblemItem } from "../terminology-demo"

export default function ProblemListBuilder({
  problems,
  onRemove,
}: {
  problems: ProblemItem[]
  onRemove: (code: string, system: string) => void
}) {
  const [resp, setResp] = useState<{ ok: boolean; entries?: number; type?: string; error?: string } | null>(null)

  async function exportBundle() {
    // Construct a minimal Bundle with Conditions
    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: problems.map((p) => ({
        resource: {
          resourceType: "Condition",
          code: {
            coding: [{ system: p.system, code: p.code, display: p.display }],
            text: p.display,
          },
        },
      })),
    }
    const r = await fetch("/api/fhir/bundle", {
      method: "POST",
      body: JSON.stringify(bundle),
      headers: { "Content-Type": "application/json" },
    })
    const j = await r.json()
    setResp(j)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">Problem List Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y rounded-md border">
          {problems.length === 0 && <li className="p-3 text-sm text-muted-foreground">No problems added yet.</li>}
          {problems.map((p) => (
            <li key={`${p.system}:${p.code}`} className="flex items-start justify-between gap-2 p-2">
              <div>
                <div className="text-sm font-medium">{p.display || p.code}</div>
                <div className="text-xs text-muted-foreground break-words">
                  {p.system} • {p.code}
                </div>
                {p.mapped && p.mapped.length > 0 && (
                  <div className="mt-1 text-xs">
                    Dual-coded: {p.mapped.map((m) => `${m.display || m.code}`).join(", ")}
                  </div>
                )}
              </div>
              <Button variant="secondary" onClick={() => onRemove(p.code, p.system)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <Button onClick={exportBundle} className="bg-primary text-primary-foreground hover:opacity-90">
            Export as FHIR Bundle
          </Button>
          {resp && (
            <div className="text-xs text-muted-foreground">
              {resp.ok ? `Accepted bundle with ${resp.entries} entries` : `Error: ${resp.error}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
