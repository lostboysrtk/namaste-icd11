import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-pretty text-3xl font-semibold">About NAMASTE – ICD‑11 Terminology Service</h1>
      <p className="leading-relaxed text-muted-foreground">
        This platform helps you find traditional NAMASTE (Ayurveda) terms and map them to ICD‑11 codes. It also provides
        FHIR-style endpoints to expand ValueSets (lists of codes) and translate codes between systems. You can paste
        CSVs to add your own concepts and validate small FHIR Bundles. Everything runs with demo data so you can try it
        immediately.
      </p>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">What you can do</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Search NAMASTE terms and see suggested ICD‑11 matches</li>
          <li>Translate a NAMASTE code to ICD‑11 (dual‑coding)</li>
          <li>Expand ValueSets (predefined lists of codes)</li>
          <li>Ingest NAMASTE codes via CSV</li>
          <li>Validate a small FHIR Bundle with NAMASTE codes</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Start here</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/getting-started" className="underline underline-offset-4">
            Beginner Guide
          </Link>
          <Link href="/docs/api" className="underline underline-offset-4">
            API Reference
          </Link>
          <Link href="/examples" className="underline underline-offset-4">
            Live Examples
          </Link>
        </div>
      </section>
    </main>
  )
}
