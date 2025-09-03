"use client"

import { useState } from "react"
import DualSearch from "./ui/dual-search"
import ProblemListBuilder from "./ui/problem-list-builder"
import FhirBundleUpload from "./ui/fhir-bundle-upload"
import AuditViewer from "./ui/audit-viewer"
import NamasteIngest from "./ui/namaste-ingest"

export type ProblemItem = {
  system: string
  code: string
  display?: string
  mapped?: { code: string; display?: string }[]
}

export default function TerminologyDemo() {
  const [problems, setProblems] = useState<ProblemItem[]>([])

  function addProblem(item: ProblemItem) {
    setProblems((prev) => {
      if (prev.some((p) => p.system === item.system && p.code === item.code)) return prev
      return [item, ...prev]
    })
  }

  function removeProblem(code: string, system: string) {
    setProblems((prev) => prev.filter((p) => !(p.code === code && p.system === system)))
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <DualSearch onAdd={addProblem} />
        <FhirBundleUpload />
        <NamasteIngest />
      </div>
      <div className="space-y-6">
        <ProblemListBuilder problems={problems} onRemove={removeProblem} />
        <AuditViewer />
      </div>
    </div>
  )
}
