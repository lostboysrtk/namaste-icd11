export function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("demo_jwt")
}
export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("demo_jwt", token)
}
export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("demo_jwt")
}
