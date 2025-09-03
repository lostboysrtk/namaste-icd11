export type Coding = {
  system: string
  code: string
  display?: string
}

export type CodeableConcept = {
  coding?: Coding[]
  text?: string
}

export type CodeSystemConcept = {
  code: string
  display?: string
  definition?: string
}

export type CodeSystem = {
  resourceType: "CodeSystem"
  id: string
  url: string
  version?: string
  name?: string
  status?: "draft" | "active" | "retired"
  content?: "complete" | "fragment" | "not-present"
  concept: CodeSystemConcept[]
}

export type ValueSetInclude = {
  system: string
  concept?: { code: string; display?: string }[]
  filter?: { property: string; op: string; value: string }[]
}

export type ValueSetCompose = {
  include: ValueSetInclude[]
}

export type ValueSetExpansionContains = {
  system?: string
  code?: string
  display?: string
}

export type ValueSet = {
  resourceType: "ValueSet"
  id: string
  url?: string
  compose?: ValueSetCompose
  expansion?: {
    contains: ValueSetExpansionContains[]
  }
}

export type ConceptMapElementTarget = {
  code: string
  display?: string
  equivalence?: "relatedto" | "equivalent" | "narrower" | "broader" | "unmatched"
}

export type ConceptMapElement = {
  code: string
  display?: string
  target: ConceptMapElementTarget[]
}

export type ConceptMapGroup = {
  source: string
  target: string
  element: ConceptMapElement[]
}

export type ConceptMap = {
  resourceType: "ConceptMap"
  id: string
  url?: string
  group: ConceptMapGroup[]
}

export type BundleEntry = {
  resource: any
}

export type Bundle = {
  resourceType: "Bundle"
  type: string
  entry?: BundleEntry[]
}

export type Condition = {
  resourceType: "Condition"
  code?: CodeableConcept
  subject?: { reference: string }
  onsetDateTime?: string
}
