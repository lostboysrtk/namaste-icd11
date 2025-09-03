"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getToken } from "@/lib/client/auth"

const fetcher = async (url: string) => {
  const r = await fetch(url, { headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {} })
  return r.json()
}

type Props = {
  onAdd: (item: {
    system: string
    code: string
    display?: string
    mapped?: { code: string; display?: string }[]
    suggestions?: { code: string; display?: string }[]
  }) => void
}

export default function DualSearch({ onAdd }: Props) {
  const [q, setQ] = useState("Agnimandya")
  const [includeIcd, setIncludeIcd] = useState(true)
  const key = q ? `/api/terminology/search?q=${encodeURIComponent(q)}${includeIcd ? "&includeIcd=1" : ""}` : null
  const { data, isLoading } = useSWR(key, fetcher)

  const items =
    data?.items?.map((it: any) => ({
      system: it.system,
      code: it.code,
      display: it.display,
      mapped: it.mapped as { code: string; display?: string }[] | undefined,
      suggestions: it.suggestions as { code: string; display?: string }[] | undefined,
    })) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">Dual Terminology Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex grow items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search NAMASTE, Ayurveda, Siddha, Unani, or biomedical term"
              aria-label="Search terminology"
            />
            <Button type="button" onClick={() => {}} className="bg-primary text-primary-foreground hover:opacity-90">
              Search
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={includeIcd}
              onChange={(e) => setIncludeIcd(e.target.checked)}
              aria-label="Include ICD-11 suggestions"
            />
            Include ICD‑11 suggestions
          </label>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted p-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Source (e.g., NAMASTE)</div>
            <div className="col-span-5">ICD-11 TM2 Mapping</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <ul className="divide-y">
            {isLoading && <li className="p-3 text-sm text-muted-foreground">Loading…</li>}
            {!isLoading && items.length === 0 && <li className="p-3 text-sm text-muted-foreground">No results</li>}
            {items.map((it: any) => (
              <li key={`${it.system}:${it.code}`} className="grid grid-cols-12 items-start gap-2 p-2">
                <div className="col-span-5">
                  <div className="text-sm font-medium">{it.display || it.code}</div>
                  <div className="break-words text-xs text-muted-foreground">
                    {it.system} • {it.code}
                  </div>
                </div>
                <div className="col-span-5 space-y-1">
                  {it.mapped && it.mapped.length > 0 ? (
                    <ul className="space-y-1">
                      {it.mapped.map((m: any) => (
                        <li key={m.code} className="text-sm">
                          <span className="font-medium">{m.display || m.code}</span>
                          <span className="ml-2 text-xs text-muted-foreground">ICD-11 TM2 • {m.code}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted-foreground">No mapping available</div>
                  )}

                  {includeIcd &&
                    (!it.mapped || it.mapped.length === 0) &&
                    it.suggestions &&
                    it.suggestions.length > 0 && (
                      <div className="rounded-md bg-card p-2">
                        <div className="text-xs font-medium text-muted-foreground">ICD‑11 suggestions</div>
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {it.suggestions.slice(0, 3).map((s: any) => (
                            <li key={s.code} className="text-xs">
                              <span className="font-medium">{s.display || s.code}</span>
                              <span className="ml-2 text-muted-foreground">{s.code}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="secondary"
                    className={cn("text-foreground")}
                    onClick={() => onAdd(it)}
                    aria-label={`Add ${it.code} to problem list`}
                  >
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
