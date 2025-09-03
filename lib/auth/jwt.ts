import { SignJWT, jwtVerify } from "jose"

const alg = "HS256"

function getSecret() {
  const secret = process.env.JWT_SECRET || "dev-demo-secret-change-me"
  return new TextEncoder().encode(secret)
}

export type DemoClaims = {
  sub: string
  role?: "clinician" | "admin" | "viewer"
  name?: string
}

export async function issueToken(claims: DemoClaims, ttlSeconds = 60 * 60) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + ttlSeconds
  return await new SignJWT({ ...claims })
    .setProtectedHeader({ alg })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: [alg] })
  return payload as DemoClaims & { exp?: number; iat?: number }
}
