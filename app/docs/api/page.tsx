export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <h1 className="text-pretty text-3xl font-semibold">API Reference (Simple)</h1>
      <p className="leading-relaxed text-muted-foreground">
        Copy‑paste these examples in your terminal. They use demo values and work without extra setup.
      </p>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Health</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s http://localhost:3000/api/health`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Terminology Search</h2>
        <p className="text-sm text-muted-foreground">Search NAMASTE terms, optionally include ICD‑11 suggestions.</p>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s "http://localhost:3000/api/terminology/search?q=agnimandya&includeIcd11=true"`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">ICD‑11 Search (demo)</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s "http://localhost:3000/api/icd11/search?q=cough"`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">ValueSet $expand</h2>
        <ul className="list-disc pl-6 text-sm text-muted-foreground">
          <li>Digestive: http://example.org/ValueSet/digestive</li>
          <li>Respiratory: http://example.org/ValueSet/respiratory</li>
          <li>Optional filter: agnimandya</li>
        </ul>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s "http://localhost:3000/api/fhir/ValueSet/$expand?url=http://example.org/ValueSet/digestive"`}</pre>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s "http://localhost:3000/api/fhir/ValueSet/$expand?url=http://example.org/ValueSet/digestive&filter=agnimandya"`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">ConceptMap $translate (NAMASTE → ICD‑11)</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s -X POST http://localhost:3000/api/fhir/ConceptMap/$translate \
  -H "Content-Type: application/json" \
  -d '{
    "coding": { "system": "http://namaste.gov.in/CodeSystem", "code": "AYU-RES-001", "display": "Kasa" },
    "targetSystem": "http://id.who.int/icd/release/11/mms"
  }'`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">CSV Ingestion</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s -X POST http://localhost:3000/api/terminology/ingest \
  -H "Content-Type: text/csv" \
  --data-binary $'code,display,definition
AYU-DIG-099,Udara Shoola,Abdominal pain potentially related to agnimandya'`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">FHIR Bundle Validate</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{`curl -s -X POST http://localhost:3000/api/fhir/bundle \
  -H "Content-Type: application/json" \
  -d '{
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
  }'`}</pre>
      </section>
    </main>
  )
}
