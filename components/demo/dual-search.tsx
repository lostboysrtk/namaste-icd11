"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DualSearchDemo() {
  const [q, setQ] = useState("")
  const [includeICD, setIncludeICD] = useState(true)
  const { data, isLoading, error } = useSWR(
    q ? `/api/demo/search?q=${encodeURIComponent(q)}&icd=${includeICD ? "1" : "0"}` : null,
    fetcher,
  )

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Dual Search (NAMASTE + ICD‑11)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search terms or codes (e.g., Vata, N-001, Migraine)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xl"
              aria-label="Search query"
            />
            <Button onClick={() => setQ(q)}>Search</Button>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeICD} onChange={(e) => setIncludeICD(e.target.checked)} />
              Include ICD‑11
            </label>
          </div>

          {isLoading && <p>Searching…</p>}
          {error && <p className="text-red-600">Error loading results</p>}

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-pretty">NAMASTE Results</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {data.namaste?.length ? (
                    data.namaste.map((c: any) => (
                      <div key={c.code} className="flex flex-col gap-1 border-b pb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{c.display}</span>
                          <span className="text-xs text-muted-foreground">{c.code}</span>
                        </div>
                        {c.definition && <p className="text-sm text-muted-foreground">{c.definition}</p>}
                        <TranslateChip code={c.code} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No results</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-pretty">ICD‑11 Results</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {data.icd11?.length ? (
                    data.icd11.map((c: any) => (
                      <div key={c.code} className="flex items-center justify-between border-b pb-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{c.display}</span>
                          <span className="text-xs text-muted-foreground">{c.code}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{includeICD ? "No results" : "ICD‑11 disabled"}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TranslateChip({ code }: { code: string }) {
  const { data, isLoading, error } = useSWR(
    code ? `/api/demo/translate?code=${encodeURIComponent(code)}` : null,
    fetcher,
  )
  if (isLoading) return <span className="text-xs">Mapping…</span>
  if (error) return <span className="text-xs text-red-600">Map error</span>
  if (!data?.targets?.length) return <span className="text-xs text-muted-foreground">No map</span>
  return (
    <div className="flex flex-wrap gap-2">
      {data.targets.map((t: any) => (
        <span
          key={t.code}
          className="text-xs px-2 py-1 rounded border bg-background"
          title={t.equivalence || "related-to"}
        >
          ICD‑11 {t.code}: {t.display}
        </span>
      ))}
    </div>
  )
}
