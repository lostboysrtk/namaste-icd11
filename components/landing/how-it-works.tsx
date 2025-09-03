export function HowItWorks() {
  const steps = [
    { step: "1", title: "Search", desc: "Query NAMASTE or ICD‑11 concepts with instant results." },
    { step: "2", title: "Map", desc: "Review suggested ICD‑11 matches and create dual-coded entries." },
    { step: "3", title: "Use FHIR", desc: "Expand ValueSets and translate with FHIR‑style endpoints." },
    { step: "4", title: "Validate", desc: "Paste a FHIR Bundle to quickly validate structure." },
  ]
  return (
    <section className="w-full">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {steps.map((s) => (
            <div key={s.step} className="rounded-lg bg-muted p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-base font-medium">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
