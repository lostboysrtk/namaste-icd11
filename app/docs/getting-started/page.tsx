"use client"

import Link from "next/link"
import DualSearch from "@/components/ui/dual-search"
import FhirBundleUpload from "@/components/ui/fhir-bundle-upload"

export default function GettingStartedPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <h1 className="text-pretty text-3xl font-semibold">Getting Started (Beginner‑friendly)</h1>
      <p className="leading-relaxed text-muted-foreground">
        This is a simple, step‑by‑step tour in plain language. It includes ready demo values. No setup is needed for the
        demo.
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Step 1 — Search terms</h2>
        <p className="leading-relaxed">
          Type one of these words in the box: <strong>agnimandya</strong>, <strong>atisara</strong>,{" "}
          <strong>kasa</strong>. These are demo NAMASTE concepts. You can also enable ICD‑11 suggestions to see demo
          matches.
        </p>
        <div className="rounded-lg border bg-card p-4">
          <DualSearch onAdd={() => {}} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Step 2 — Expand a ValueSet</h2>
        <p className="leading-relaxed">
          A ValueSet is a list of codes. Try these URLs with the <code>$expand</code> endpoint:
        </p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground">
          <li>http://example.org/ValueSet/digestive</li>
          <li>http://example.org/ValueSet/respiratory</li>
          <li>
            Optional filter: <code>agnimandya</code>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          In the API Reference you can copy‑paste curl examples for these URLs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Step 3 — Add a code via CSV (optional)</h2>
        <p className="leading-relaxed">
          Paste this single CSV row in the Ingestion panel on the homepage, then search “udara”:
        </p>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`code,display,definition
AYU-DIG-099,Udara Shoola,Abdominal pain potentially related to agnimandya`}</pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Step 4 — Validate a FHIR Bundle</h2>
        <p className="leading-relaxed">
          Paste this JSON into the validator. It contains a Condition with code <code>AYU-DIG-001</code> (Agnimandya).
        </p>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "code": {
          "coding": [
            {
              "system": "http://namaste.gov.in/CodeSystem",
              "code": "AYU-DIG-001",
              "display": "Agnimandya"
            }
          ],
          "text": "Agnimandya"
        }
      }
    }
  ]
}`}</pre>
        <div className="rounded-lg border bg-card p-4">
          <FhirBundleUpload />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What’s next?</h2>
        <p className="leading-relaxed">
          Ready to call the APIs directly? See the{" "}
          <Link href="/docs/api" className="underline underline-offset-4">
            API Reference
          </Link>
          . Prefer a hands‑on tour? Try the{" "}
          <Link href="/examples" className="underline underline-offset-4">
            Live Examples
          </Link>
          . Curious about the platform? Read the{" "}
          <Link href="/about" className="underline underline-offset-4">
            About page
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
