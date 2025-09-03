type IcdItem = { code: string; title: string }

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const cache = new Map<string, { ts: number; data: IcdItem[] }>()

function now() {
  return Date.now()
}

function getEnv() {
  // These are server-only; Next.js supports server env in route handlers
  const base = process.env.ICD11_BASE_URL || "https://id.who.int/icd"
  const token = process.env.ICD11_API_TOKEN // optional
  return { base, token }
}

async function fetchIcd11(query: string): Promise<IcdItem[]> {
  const { base, token } = getEnv()
  // naive endpoint; replace with official ICD-11 search endpoint if provided
  const url = `${base}/entity/search?q=${encodeURIComponent(query)}&flatResults=true&limit=5`

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`ICD-11 fetch failed: ${res.status}`)
  }
  const json = await res.json().catch(() => ({}))
  // normalize to code/title pairs best-effort
  const items: IcdItem[] = Array.isArray(json?.destinationEntities)
    ? json.destinationEntities.slice(0, 5).map((e: any) => ({
        code: e?.theCode || e?.code || e?.id || "ICD-UNKNOWN",
        title: e?.title || e?.title?.value || e?.label || "Untitled",
      }))
    : Array.isArray(json?.items)
      ? json.items.slice(0, 5).map((e: any) => ({ code: e.code || e.id, title: e.title || e.label }))
      : []
  return items
}

function mockSearch(query: string): IcdItem[] {
  const q = query.toLowerCase()
  const pool: IcdItem[] = [
    { code: "TM2-DA01", title: "Disorder of digestive qi transformation" },
    { code: "TM2-RE02", title: "Respiratory tract qi obstruction" },
    { code: "TM2-GE10", title: "General imbalance pattern" },
  ]
  return pool.filter((x) => x.title.toLowerCase().includes(q)).slice(0, 3)
}

export async function icd11Search(query: string): Promise<IcdItem[]> {
  const key = `q:${query}`
  const hit = cache.get(key)
  if (hit && now() - hit.ts < CACHE_TTL_MS) return hit.data

  try {
    const data = process.env.ICD11_API_TOKEN ? await fetchIcd11(query) : mockSearch(query)
    cache.set(key, { ts: now(), data })
    return data
  } catch {
    const data = mockSearch(query)
    cache.set(key, { ts: now(), data })
    return data
  }
}
