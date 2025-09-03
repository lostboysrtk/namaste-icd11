export function Features() {
  const items = [
    { title: "Dual Coding", desc: "Search NAMASTE with suggested ICD‑11 matches for clean, auditable mapping." },
    { title: "FHIR Operations", desc: "Standards-aligned ValueSet $expand and ConceptMap $translate endpoints." },
    { title: "CSV Ingestion", desc: "Load NAMASTE concepts from CSV to power demo deployments quickly." },
    { title: "Demo First", desc: "Seeded in-memory data so you can explore without credentials." },
  ]
  return (
    <section className="w-full bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((f) => (
            <div key={f.title} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
