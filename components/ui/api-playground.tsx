"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getToken } from "@/lib/client/auth"

export default function ApiPlayground() {
  const [expandUrl, setExpandUrl] = useState("http://example.org/ValueSet/digestive")
  const [translateSystem, setTranslateSystem] = useState("http://namaste.gov.in/CodeSystem")
  const [translateCode, setTranslateCode] = useState("AYU-DIG-001")
  const [translateTarget, setTranslateTarget] = useState("http://id.who.int/icd/release/11/mms")
  const [output, setOutput] = useState("")

  async function callExpand() {
    const r = await fetch("/api/fhir/ValueSet/$expand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: JSON.stringify({ url: expandUrl }),
    })
    const j = await r.json()
    setOutput(JSON.stringify(j, null, 2))
  }

  async function callTranslate() {
    const r = await fetch("/api/fhir/ConceptMap/$translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: JSON.stringify({
        coding: { system: translateSystem, code: translateCode },
        targetSystem: translateTarget,
      }),
    })
    const j = await r.json()
    setOutput(JSON.stringify(j, null, 2))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">API Playground</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">ValueSet $expand</div>
            <Input value={expandUrl} onChange={(e) => setExpandUrl(e.target.value)} aria-label="ValueSet URL" />
            <Button onClick={callExpand} className="bg-primary text-primary-foreground hover:opacity-90">
              Expand
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">ConceptMap $translate</div>
            <Input
              value={translateSystem}
              onChange={(e) => setTranslateSystem(e.target.value)}
              aria-label="Source system"
            />
            <Input value={translateCode} onChange={(e) => setTranslateCode(e.target.value)} aria-label="Source code" />
            <Input
              value={translateTarget}
              onChange={(e) => setTranslateTarget(e.target.value)}
              aria-label="Target system"
            />
            <Button onClick={callTranslate} className="bg-primary text-primary-foreground hover:opacity-90">
              Translate
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">Response</div>
          <Textarea readOnly value={output} className="h-56" />
        </div>
      </CardContent>
    </Card>
  )
}
