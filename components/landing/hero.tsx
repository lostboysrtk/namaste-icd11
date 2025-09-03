import Link from "next/link"

export function Hero() {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-5xl">
            NAMASTE × ICD‑11 FHIR Terminology Service
          </h1>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Demo-ready microservice bridging AYUSH NAMASTE and WHO ICD‑11 TM2 using FHIR R4. Search concepts, map dual
            codes, expand ValueSets, and validate FHIR Bundles—no external setup required.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Read the Docs
            </Link>
            <a
              href="#demo"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Try the Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
