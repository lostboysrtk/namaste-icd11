"use client"

import useSWR from "swr"
import DualSearch from "@/components/ui/dual-search"
import FhirBundleUpload from "@/components/ui/fhir-bundle-upload"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function ExpandValueSetDemo() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/fhir/ValueSet/$expand?url=http://example.org/ValueSet/digestive",
    fetcher,
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">ValueSet $expand (digestive)</h3>
        <button className="text-sm underline underline-offset-4" onClick={() => mutate()}>
          Refresh
        </button>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">Failed to load.</p>}
      {data && <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export default function ExamplesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <h1 className="text-pretty text-3xl font-semibold">Examples (Live)</h1>
      <p className="leading-relaxed text-muted-foreground">
        Try these live widgets and see real responses from the demo APIs.
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Dual Terminology Search</h2>
        <p className="leading-relaxed">
          Try typing: <strong>agnimandya</strong>, <strong>atisara</strong>, <strong>kasa</strong>. Enable ICD‑11
          suggestions to see demo matches.
        </p>
        <div className="rounded-lg border bg-card p-4">
          <DualSearch onAdd={() => {}} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">ValueSet Expansion</h2>
        <p className="leading-relaxed">
          This calls <code>/api/fhir/ValueSet/$expand</code> with the demo URL{" "}
          <code>http://example.org/ValueSet/digestive</code>.
        </p>
        <div className="rounded-lg border bg-card p-4">
          <ExpandValueSetDemo />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">FHIR Bundle Upload / Validate</h2>
        <p className="leading-relaxed">Paste the sample Condition bundle from the docs and submit to see a response.</p>
        <div className="rounded-lg border bg-card p-4">
          <FhirBundleUpload />
        </div>
      </section>
    </main>
  )
}
