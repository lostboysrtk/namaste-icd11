import { verifyToken } from "./jwt"

export type AuthContext = {
  userId: string
  role?: string
  name?: string
} | null

export async function getAuthContextFromRequest(req: Request): Promise<AuthContext> {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization")
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null
  const token = auth.slice(7).trim()
  try {
    const claims = await verifyToken(token)
    return { userId: claims.sub, role: claims.role, name: claims.name }
  } catch {
    return null
  }
}

// Optional guard
export async function requireAuth(req: Request): Promise<AuthContext> {
  const ctx = await getAuthContextFromRequest(req)
  if (!ctx) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 })
  }
  return ctx
}
