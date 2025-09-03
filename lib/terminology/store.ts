import type { CodeSystem, ConceptMap, ValueSet, Coding } from "../fhir/types"

type AuditEvent = {
  ts: string
  event: string
  meta?: Record<string, any>
}

type Consent = {
  id: string
  subjectId: string
  purpose: string
  scope: string
  issuedAt: string
  expiresAt?: string
  actor?: string
}

// CSV ingestion utilities
function parseCsv(text: string): Array<Record<string, string>> {
  // Simple CSV parser for comma-delimited with quoted values
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const rows: Array<Record<string, string>> = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    const row: Record<string, string> = {}
    header.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim()
    })
    rows.push(row)
  }
  return rows
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // escaped quote
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur)
      cur = ""
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

class TerminologyStore {
  // Simplified canonical URLs
  static NAMASTE_URL = "http://namaste.gov.in/CodeSystem"
  static ICD11_TM2_URL = "http://id.who.int/icd/release/11/mms" // placeholder

  codeSystems: Record<string, CodeSystem> = {}
  conceptMaps: ConceptMap[] = []
  valueSets: Record<string, ValueSet> = {}
  audit: AuditEvent[] = []
  consents: Consent[] = []

  constructor() {
    // Seed minimal concepts for demo
    const namaste: CodeSystem = {
      resourceType: "CodeSystem",
      id: "namaste",
      url: TerminologyStore.NAMASTE_URL,
      name: "NAMASTE Traditional Medicine",
      status: "active",
      content: "fragment",
      concept: [
        {
          code: "AYU-DIG-001",
          display: "Agnimandya (digestive fire deficiency)",
          definition: "Low digestive fire leading to indigestion and malabsorption",
        },
        {
          code: "AYU-RES-002",
          display: "Kasa (cough)",
          definition: "Cough due to vitiated doshas affecting pranavaha srotas",
        },
        { code: "SID-DIG-010", display: "Neerilivu (indigestion)", definition: "Siddha concept of impaired digestion" },
        { code: "UNA-RES-021", display: "Nazla (catarrh)", definition: "Unani concept of rhinorrhea/catarrh" },
        // Added seeds for demo breadth
        { code: "AYU-NEU-005", display: "Shirashoola (headache)", definition: "Headache due to vata/pitta vitiation" },
        {
          code: "AYU-DIG-011",
          display: "Amla pitta (acid dyspepsia)",
          definition: "Hyperacidity/acid reflux equivalent",
        },
        { code: "SID-RES-015", display: "Irumal (cough - Siddha)", definition: "Siddha cough pattern" },
        { code: "UNA-DIG-030", display: "So-e-Meda (metabolic disorder)", definition: "Unani metabolic imbalance" },
      ],
    }

    const icd11: CodeSystem = {
      resourceType: "CodeSystem",
      id: "icd11-tm2",
      url: TerminologyStore.ICD11_TM2_URL,
      name: "ICD-11 Traditional Medicine Module 2",
      status: "active",
      content: "fragment",
      concept: [
        { code: "TM2-DA01", display: "Disorder of digestive qi transformation" },
        { code: "TM2-RE02", display: "Respiratory tract qi obstruction" },
        // Additional demo TM2 patterns
        { code: "TM2-HE01", display: "Head wind pattern" },
        { code: "TM2-DA02", display: "Stomach heat with counterflow" },
        { code: "TM2-GE10", display: "General qi/blood disharmony" },
      ],
    }

    const namasteToIcd: ConceptMap = {
      resourceType: "ConceptMap",
      id: "map-namaste-icd11",
      url: "http://example.org/ConceptMap/namaste-icd11",
      group: [
        {
          source: namaste.url,
          target: icd11.url,
          element: [
            {
              code: "AYU-DIG-001",
              display: "Agnimandya",
              target: [
                { code: "TM2-DA01", display: "Disorder of digestive qi transformation", equivalence: "relatedto" },
                { code: "TM2-DA02", display: "Stomach heat with counterflow", equivalence: "narrower" },
              ],
            },
            {
              code: "AYU-RES-002",
              display: "Kasa",
              target: [{ code: "TM2-RE02", display: "Respiratory tract qi obstruction", equivalence: "relatedto" }],
            },
            {
              code: "SID-DIG-010",
              display: "Neerilivu",
              target: [
                { code: "TM2-DA01", display: "Disorder of digestive qi transformation", equivalence: "relatedto" },
              ],
            },
            {
              code: "UNA-RES-021",
              display: "Nazla",
              target: [{ code: "TM2-RE02", display: "Respiratory tract qi obstruction", equivalence: "relatedto" }],
            },
            // New mappings
            {
              code: "AYU-NEU-005",
              display: "Shirashoola (headache)",
              target: [{ code: "TM2-HE01", display: "Head wind pattern", equivalence: "relatedto" }],
            },
            {
              code: "AYU-DIG-011",
              display: "Amla pitta (acid dyspepsia)",
              target: [
                { code: "TM2-DA02", display: "Stomach heat with counterflow", equivalence: "equivalent" },
                { code: "TM2-DA01", display: "Disorder of digestive qi transformation", equivalence: "broader" },
              ],
            },
            {
              code: "SID-RES-015",
              display: "Irumal (cough - Siddha)",
              target: [{ code: "TM2-RE02", display: "Respiratory tract qi obstruction", equivalence: "relatedto" }],
            },
            {
              code: "UNA-DIG-030",
              display: "So-e-Meda (metabolic disorder)",
              target: [{ code: "TM2-GE10", display: "General qi/blood disharmony", equivalence: "relatedto" }],
            },
          ],
        },
      ],
    }

    this.codeSystems[namaste.url] = namaste
    this.codeSystems[icd11.url] = icd11
    this.conceptMaps = [namasteToIcd]

    // Example ValueSets
    this.valueSets["http://example.org/ValueSet/digestive"] = {
      resourceType: "ValueSet",
      id: "digestive",
      url: "http://example.org/ValueSet/digestive",
      compose: {
        include: [
          {
            system: namaste.url,
            concept: [
              { code: "AYU-DIG-001", display: "Agnimandya" },
              { code: "SID-DIG-010", display: "Neerilivu" },
              { code: "AYU-DIG-011", display: "Amla pitta" },
              { code: "UNA-DIG-030", display: "So-e-Meda" },
            ],
          },
        ],
      },
    }

    // Added respiratory ValueSet to demo $expand with filters
    this.valueSets["http://example.org/ValueSet/respiratory"] = {
      resourceType: "ValueSet",
      id: "respiratory",
      url: "http://example.org/ValueSet/respiratory",
      compose: {
        include: [
          {
            system: namaste.url,
            concept: [
              { code: "AYU-RES-002", display: "Kasa" },
              { code: "SID-RES-015", display: "Irumal" },
              { code: "UNA-RES-021", display: "Nazla" },
            ],
          },
        ],
      },
    }
  }

  log(event: string, meta?: Record<string, any>) {
    this.audit.unshift({ ts: new Date().toISOString(), event, meta })
    // Keep only latest 200
    if (this.audit.length > 200) this.audit.length = 200
  }

  search(query: string, systems?: string[]) {
    const q = query.trim().toLowerCase()
    const urls = systems && systems.length ? systems : Object.keys(this.codeSystems)
    const results: { system: string; code: string; display?: string }[] = []
    for (const url of urls) {
      const cs = this.codeSystems[url]
      cs.concept.forEach((c) => {
        if (c.code.toLowerCase().includes(q) || (c.display && c.display.toLowerCase().includes(q))) {
          results.push({ system: url, code: c.code, display: c.display })
        }
      })
    }
    this.log("terminology.search", { query, systems })
    return results
  }

  translate(coding: Coding, targetSystem: string) {
    // Only supports direct mapping via seeded ConceptMap
    for (const cm of this.conceptMaps) {
      if (cm.group.some((g) => g.source === coding.system && g.target === targetSystem)) {
        const group = cm.group.find((g) => g.source === coding.system && g.target === targetSystem)!
        const el = group.element.find((e) => e.code === coding.code)
        if (el) {
          this.log("terminology.translate", { from: coding, toSystem: targetSystem })
          return el.target
        }
      }
    }
    this.log("terminology.translate.unmatched", { from: coding, toSystem: targetSystem })
    return []
  }

  expandValueSet(urlOrId: string) {
    const vs = this.valueSets[urlOrId] || this.valueSets[`http://example.org/ValueSet/${urlOrId}`]
    if (!vs?.compose) return { contains: [] }
    const contains =
      vs.compose.include.flatMap((inc) => {
        const sys = this.codeSystems[inc.system]
        if (!sys) return []
        if (inc.concept && inc.concept.length) {
          return inc.concept.map((c) => ({ system: inc.system, code: c.code, display: c.display }))
        }
        // If no explicit concept list, return all that match filters (ignored in demo)
        return sys.concept.map((c) => ({ system: inc.system, code: c.code, display: c.display }))
      }) || []
    this.log("terminology.valueset.expand", { urlOrId })
    return { contains }
  }

  ingestNamasteCsv(csv: string, { systemUrl }: { systemUrl?: string } = {}) {
    const url = systemUrl || (this.constructor as any).NAMASTE_URL
    const cs = this.codeSystems[url] || {
      resourceType: "CodeSystem",
      id: "namaste",
      url,
      name: "NAMASTE Traditional Medicine",
      status: "active",
      content: "fragment",
      concept: [],
    }

    const before = cs.concept.length
    const rows = parseCsv(csv)
    for (const r of rows) {
      const code = r["code"] || r["concept"] || r["id"]
      if (!code) continue
      const display = r["display"] || r["name"] || r["term"]
      const definition = r["definition"] || r["desc"] || r["description"]
      const idx = cs.concept.findIndex((c) => c.code === code)
      if (idx >= 0) {
        // update existing
        cs.concept[idx] = {
          code,
          display: display || cs.concept[idx].display,
          definition: definition || cs.concept[idx].definition,
        }
      } else {
        cs.concept.push({ code, display, definition })
      }
    }

    this.codeSystems[url] = cs
    const after = cs.concept.length
    const added = Math.max(0, after - before)
    const updated = rows.length - added
    this.log("terminology.ingest.namaste.csv", { added, updated, total: after })
    return { added, updated, total: after }
  }

  createConsent(input: { subjectId: string; purpose: string; scope: string; expiresAt?: string; actor?: string }) {
    const c: Consent = {
      id: `consent-${Math.random().toString(36).slice(2, 8)}`,
      subjectId: input.subjectId,
      purpose: input.purpose,
      scope: input.scope,
      issuedAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
      actor: input.actor,
    }
    this.consents.unshift(c)
    if (this.consents.length > 200) this.consents.length = 200
    return c
  }
}

// Singleton
let _store: TerminologyStore | null = null
export function getStore() {
  if (!_store) _store = new TerminologyStore()
  return _store
}
