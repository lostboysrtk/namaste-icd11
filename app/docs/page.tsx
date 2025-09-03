import type React from "react"
import Link from "next/link"

export const metadata = {
  title: "Documentation | NAMASTE × ICD‑11 FHIR Terminology Service",
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-3 overflow-auto rounded-md border border-border bg-muted p-4 text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

function Toc() {
  const links = [
    { href: "#overview", label: "Overview" },
    { href: "#architecture", label: "Architecture" },
    { href: "#quickstart", label: "Quickstart (Demo Mode)" },
    { href: "#beginner-guide", label: "Step-by-Step Guide" },
    { href: "#api", label: "API Reference" },
    { href: "#auth", label: "Authentication" },
    { href: "#config", label: "Configuration" },
    { href: "#glossary", label: "Glossary & FAQ" },
  ]
  return (
    <nav className="sticky top-4 hidden h-max w-64 shrink-0 rounded-lg border border-border bg-card p-4 md:block">
      <p className="text-sm font-medium">On this page</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <a className="text-muted-foreground hover:text-foreground" href={l.href}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function DocsPage() {
  return (
    <main className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <Toc />
          <article className="min-w-0 flex-1">
            <header className="mb-6">
              <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">Documentation</h1>
              <p className="mt-2 max-w-2xl text-balance text-muted-foreground">
                A complete guide to what this platform does and how to use it—perfect for beginners and integrators.
              </p>
            </header>

            <section id="overview" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-2 leading-relaxed">
                This demo-ready terminology microservice bridges AYUSH NAMASTE concepts with WHO ICD‑11 TM2 via FHIR R4
                patterns. It ships with seeded values so you can search concepts, review dual-code mappings, expand
                ValueSets, and validate FHIR Bundles without external credentials.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                <li>Dual coding: NAMASTE concepts with suggested ICD‑11 matches</li>
                <li>FHIR operations: ValueSet $expand and ConceptMap $translate</li>
                <li>CSV ingestion for NAMASTE concepts</li>
                <li>Demo-first: run immediately with seeded data</li>
              </ul>
            </section>

            <section id="architecture" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Architecture</h2>
              <p className="mt-2 leading-relaxed">
                Built with Next.js (App Router). API routes expose health, terminology search, FHIR operations,
                ingestion, and optional ICD‑11 lookups. An in-memory store holds seeded concepts and mappings for the
                demo. The UI provides a dual-search workflow and simple tools for expansion, translation, ingestion, and
                validation.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                <li>
                  API: /api/health, /api/terminology/search, /api/icd11/search (optional), /api/fhir/ValueSet/$expand,
                  /api/fhir/ConceptMap/$translate, /api/terminology/ingest, /api/fhir/bundle
                </li>
                <li>Storage: In-memory seeds for demo; swap to DB later if needed</li>
                <li>UI: Dual search with mapping review, CSV ingest, and Bundle validate</li>
              </ul>
            </section>

            <section id="quickstart" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Quickstart (Demo Mode)</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-6 text-sm leading-relaxed">
                <li>Open the home page and scroll to the Demo section.</li>
                <li>Try searches like “Agnimandya”, “Kasa”, or “headache”.</li>
                <li>Review NAMASTE results and suggested ICD‑11 matches.</li>
                <li>Click Docs for API examples and endpoints.</li>
              </ol>
              <div className="mt-3">
                <Link href="/#demo" className="text-primary underline">
                  Jump to the Demo
                </Link>
              </div>
            </section>

            <section id="beginner-guide" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Step-by-Step Guide for Beginners</h2>
              <ol className="mt-2 list-decimal space-y-4 pl-6 leading-relaxed">
                <li>
                  Search a NAMASTE concept:
                  <Code>{`GET /api/terminology/search?q=Agnimandya`}</Code>
                </li>
                <li>
                  See ICD‑11 suggestions (if enabled):
                  <Code>{`GET /api/icd11/search?q=headache`}</Code>
                </li>
                <li>
                  Expand a ValueSet:
                  <Code>{`GET /api/fhir/ValueSet/$expand?url=http://example.org/ValueSet/digestive`}</Code>
                </li>
                <li>
                  Translate a code via ConceptMap:
                  <Code>{`POST /api/fhir/ConceptMap/$translate
Content-Type: application/json

{
  "coding": { "system": "http://namaste.gov.in/CodeSystem", "code": "AYU-DIG-001" },
  "targetSystem": "http://id.who.int/icd/release/11/mms"
}`}</Code>
                </li>
                <li>
                  Ingest NAMASTE CSV (demo):
                  <Code>{`POST /api/terminology/ingest
Content-Type: text/csv

code,display,definition
AYU-DIG-012,Atisara,Loose stools due to agnimandya`}</Code>
                </li>
                <li>
                  Validate a FHIR Bundle:
                  <Code>{`POST /api/fhir/bundle
Content-Type: application/json

{"resourceType":"Bundle","type":"collection","entry":[{"resource":{"resourceType":"Condition"}}]}`}</Code>
                </li>
              </ol>
            </section>

            <section id="api" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">API Reference</h2>

              <h3 className="mt-4 text-lg font-semibold">Health</h3>
              <Code>{`GET /api/health`}</Code>

              <h3 className="mt-6 text-lg font-semibold">Terminology Search</h3>
              <Code>{`GET /api/terminology/search?q={query}`}</Code>

              <h3 className="mt-6 text-lg font-semibold">ICD‑11 Search (Optional)</h3>
              <Code>{`GET /api/icd11/search?q={query}`}</Code>

              <h3 className="mt-6 text-lg font-semibold">ValueSet $expand</h3>
              <Code>{`GET /api/fhir/ValueSet/$expand?url={valueset-url}&filter={text}`}</Code>

              <h3 className="mt-6 text-lg font-semibold">ConceptMap $translate</h3>
              <Code>{`POST /api/fhir/ConceptMap/$translate
Content-Type: application/json
{ "coding": { "system": "...", "code": "..." }, "targetSystem": "..." }`}</Code>

              <h3 className="mt-6 text-lg font-semibold">CSV Ingestion</h3>
              <Code>{`POST /api/terminology/ingest
Content-Type: text/csv`}</Code>

              <h3 className="mt-6 text-lg font-semibold">Bundle Validate</h3>
              <Code>{`POST /api/fhir/bundle
Content-Type: application/json`}</Code>
            </section>

            <section id="auth" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Authentication</h2>
              <p className="mt-2 leading-relaxed">
                In demo mode, endpoints are open. You can later enable JWT on write endpoints (ingest, bundle) with a
                shared secret. The UI attaches tokens automatically if present.
              </p>
              <Code>{`# Example Authorization header
Authorization: Bearer <demo-jwt>`}</Code>
            </section>

            <section id="config" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Configuration</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                <li>ICD11_BASE_URL (optional): WHO ICD‑11 API base URL</li>
                <li>ICD11_API_TOKEN (optional): WHO ICD‑11 API token</li>
                <li>JWT_SECRET (optional): enable demo JWT verification</li>
              </ul>
            </section>

            <section id="glossary" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold">Glossary & FAQ</h2>
              <p className="mt-2 leading-relaxed">
                <span className="font-medium">NAMASTE</span>: AYUSH terminology initiative.{" "}
                <span className="font-medium">ICD‑11 TM2</span>: WHO classification for traditional medicine.{" "}
                <span className="font-medium">FHIR</span>: HL7 standard for healthcare data exchange.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                <li>Can I run this without credentials? Yes—demo seeds are included.</li>
                <li>How do I persist data? Swap the in-memory store for a database (e.g., Neon/Supabase).</li>
                <li>Is this production-ready? It’s a demo foundation—add auth, RLS, and persistence for production.</li>
              </ul>
              <footer className="mt-8 border-t pt-6 text-sm text-muted-foreground">
                See also:{" "}
                <Link href="/" className="text-primary underline">
                  Home
                </Link>{" "}
                •{" "}
                <a href="/#demo" className="text-primary underline">
                  Try the Demo
                </a>
              </footer>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}
