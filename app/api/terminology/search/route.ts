import { type NextRequest, NextResponse } from "next/server"
import { getStore } from "@/lib/terminology/store"
import { icd11Search } from "@/lib/integrations/icd11"
import { getAuthContextFromRequest } from "@/lib/auth/context"

export async function GET(req: NextRequest) {
  const user = await getAuthContextFromRequest(req)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const system = searchParams.get("system")
  const includeIcd = searchParams.get("includeIcd") === "1"
  const store = getStore()

  const systems = system
    ? [
        system === "namaste"
          ? (getStore().constructor as any)["NAMASTE_URL"]
          : system === "icd11"
            ? (getStore().constructor as any)["ICD11_TM2_URL"]
            : system,
      ]
    : undefined

  const items = store.search(q, systems)

  let icdSuggestions: { code: string; display?: string }[] = []
  if (includeIcd && q) {
    const sug = await icd11Search(q)
    icdSuggestions = sug.map((s) => ({ code: s.code, display: s.title }))
  }

  const enriched = items.map((it) => {
    let mapped: { code: string; display?: string }[] = []
    if (it.system === (getStore().constructor as any)["NAMASTE_URL"]) {
      mapped = store.translate(
        { system: it.system, code: it.code, display: it.display },
        (getStore().constructor as any)["ICD11_TM2_URL"],
      )
    }
    const suggestions = mapped.length ? [] : icdSuggestions
    return { ...it, mapped, suggestions }
  })

  store.log("terminology.search.api", { query: q, includeIcd, actor: user?.userId })
  return NextResponse.json({ query: q, items: enriched })
}
