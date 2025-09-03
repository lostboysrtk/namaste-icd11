export type DemoConcept = {
  system: "NAMASTE" | "ICD-11"
  code: string
  display: string
  definition?: string
}

export const namasteConcepts: DemoConcept[] = [
  {
    system: "NAMASTE",
    code: "N-001",
    display: "Vata imbalance",
    definition: "Disorder characterized by vata dosha predominance",
  },
  {
    system: "NAMASTE",
    code: "N-002",
    display: "Pitta imbalance",
    definition: "Disorder characterized by pitta dosha predominance",
  },
  {
    system: "NAMASTE",
    code: "N-003",
    display: "Kapha imbalance",
    definition: "Disorder characterized by kapha dosha predominance",
  },
  { system: "NAMASTE", code: "N-010", display: "Agnimandya (low digestive fire)" },
  { system: "NAMASTE", code: "N-020", display: "Ama accumulation (toxins)" },
]

// very small ICD-11 set for demo (subset; codes are illustrative)
export const icd11Concepts: DemoConcept[] = [
  { system: "ICD-11", code: "ME84", display: "Functional gastrointestinal disorder, unspecified" },
  { system: "ICD-11", code: "MB23", display: "Headache disorder, unspecified" },
  { system: "ICD-11", code: "MB20", display: "Migraine" },
  { system: "ICD-11", code: "FA00", display: "General symptoms, signs or clinical findings" },
]

// simple ConceptMap: NAMASTE -> ICD-11 (many-to-one allowed)
export type DemoMapping = {
  sourceCode: string // NAMASTE code
  targets: { code: string; display?: string; equivalence?: "equivalent" | "related-to" }[]
}

export const namasteToIcd11Map: DemoMapping[] = [
  { sourceCode: "N-001", targets: [{ code: "FA00", equivalence: "related-to" }] },
  { sourceCode: "N-002", targets: [{ code: "MB20", equivalence: "related-to" }] },
  { sourceCode: "N-003", targets: [{ code: "FA00", equivalence: "related-to" }] },
  { sourceCode: "N-010", targets: [{ code: "ME84", equivalence: "related-to" }] },
  { sourceCode: "N-020", targets: [{ code: "FA00", equivalence: "related-to" }] },
]

// tiny search helpers
export function searchNamaste(q: string) {
  const term = q.trim().toLowerCase()
  if (!term) return []
  return namasteConcepts.filter(
    (c) =>
      c.code.toLowerCase().includes(term) ||
      c.display.toLowerCase().includes(term) ||
      (c.definition?.toLowerCase().includes(term) ?? false),
  )
}

export function searchIcd11(q: string) {
  const term = q.trim().toLowerCase()
  if (!term) return []
  return icd11Concepts.filter((c) => c.code.toLowerCase().includes(term) || c.display.toLowerCase().includes(term))
}

export function mapNamasteToIcd11(sourceCode: string) {
  const m = namasteToIcd11Map.find((x) => x.sourceCode === sourceCode)
  if (!m) return []
  return m.targets.map((t) => {
    const icd = icd11Concepts.find((c) => c.code === t.code)
    return {
      code: t.code,
      display: t.display || icd?.display || "",
      equivalence: t.equivalence || "related-to",
    }
  })
}
