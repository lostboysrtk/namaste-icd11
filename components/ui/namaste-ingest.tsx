"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getToken } from "@/lib/client/auth"

const sample = [
  "code,display,definition",
  '"AYU-DIG-100","Grahani","Disorder related to digestive fire and absorption"',
  '"AYU-RES-200","Shwasa","Breathlessness; respiratory imbalance"',
].join("\n")

export default function NamasteIngest() {
  const [text, setText] = useState<string>("")
  const [result, setResult] = useState<{
    ok: boolean
    added?: number
    updated?: number
    total?: number
    error?: string
  } | null>(null)
  const [busy, setBusy] = useState(false)

  async function ingest() {
    setBusy(true)
    try {
      const r = await fetch("/api/terminology/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ csv: text }),
      })
      const j = await r.json()
      setResult(j)
    } catch (e) {
      setResult({ ok: false, error: "Network error" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">Ingest NAMASTE CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Paste a CSV with columns: code, display, definition. This updates the in-memory NAMASTE CodeSystem.
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setText(sample)}>
            Load sample
          </Button>
          <Button type="button" variant="secondary" onClick={() => setText("")}>
            Clear
          </Button>
        </div>
        <Textarea
          aria-label="NAMASTE CSV"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={sample}
          className="h-40"
        />
        <div className="flex items-center justify-between">
          <Button onClick={ingest} disabled={busy} className="bg-primary text-primary-foreground hover:opacity-90">
            {busy ? "Ingesting…" : "Ingest CSV"}
          </Button>
          {result && (
            <div className="text-xs text-muted-foreground">
              {result.ok
                ? `Added ${result.added} • Updated ${result.updated} • Total ${result.total}`
                : `Error: ${result.error}`}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: After ingesting, try searching the new codes in Dual Terminology Search.
        </p>
      </CardContent>
    </Card>
  )
}
