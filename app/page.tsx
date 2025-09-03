import TerminologyDemo from "@/components/terminology-demo"
import AuthPanel from "@/components/ui/auth-panel"
import ApiPlayground from "@/components/ui/api-playground"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-pretty text-2xl font-semibold text-foreground">NAMASTE – ICD-11 TM2 Terminology Service</h1>
        <div className="flex items-center gap-4">
          <a
            href="/about"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
            aria-label="About"
          >
            About
          </a>
          <a
            href="/docs/getting-started"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
            aria-label="Beginner Guide"
          >
            Getting Started
          </a>
          <a
            href="/docs/api"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
            aria-label="API Reference"
          >
            API
          </a>
          <a
            href="/examples"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
            aria-label="Live Examples"
          >
            Examples
          </a>
          <a
            href="/docs"
            className="text-sm text-foreground underline underline-offset-4 hover:text-primary"
            aria-label="Documentation"
          >
            Docs
          </a>
          <a
            href="/api/health"
            className="text-sm text-primary underline underline-offset-4"
            aria-label="Health check endpoint"
          >
            Health
          </a>
        </div>
      </header>

      <Hero />
      <Features />
      <HowItWorks />

      <section id="demo" className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Live Demo</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AuthPanel />
          <ApiPlayground />
        </div>

        <div className="mt-6">
          <TerminologyDemo />
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Prototype demo for dual-coding, ValueSet expansion, ConceptMap translation, FHIR bundle processing, and demo
        OAuth/JWT.
      </footer>
    </main>
  )
}
