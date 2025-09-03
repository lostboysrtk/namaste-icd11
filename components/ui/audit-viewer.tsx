"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AuditViewer() {
  const { data } = useSWR("/api/audit", fetcher, { refreshInterval: 5000 })
  const items: { ts: string; event: string; meta?: Record<string, any> }[] = data?.audit || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y rounded-md border">
          {items.length === 0 && <li className="p-3 text-sm text-muted-foreground">No audit events yet.</li>}
          {items.map((e, idx) => (
            <li key={idx} className="p-2">
              <div className="text-xs text-muted-foreground">{new Date(e.ts).toLocaleString()}</div>
              <div className="text-sm">{e.event}</div>
              {e.meta && (
                <pre className="mt-1 overflow-auto rounded bg-muted p-2 text-[11px] text-foreground">
                  {JSON.stringify(e.meta, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
