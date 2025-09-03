"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getToken } from "@/lib/client/auth"

export default function FhirBundleUpload() {
  const [text, setText] = useState<string>("")

  async function submit() {
    try {
      const parsed = JSON.parse(text)
      const r = await fetch("/api/fhir/bundle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify(parsed),
      })
      const j = await r.json()
      alert(`Response: ${JSON.stringify(j)}`)
    } catch (e: any) {
      alert("Invalid JSON")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">FHIR Bundle Upload/Validate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          placeholder='Paste Bundle JSON here, e.g. {"resourceType":"Bundle","type":"collection","entry":[...] }'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-36"
          aria-label="FHIR Bundle JSON"
        />
        <div className="flex justify-end">
          <Button onClick={submit} className="bg-primary text-primary-foreground hover:opacity-90">
            Validate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
