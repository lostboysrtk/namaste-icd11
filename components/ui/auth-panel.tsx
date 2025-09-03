"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getToken, setToken, clearToken } from "@/lib/client/auth"

export default function AuthPanel() {
  const [userId, setUserId] = useState("clinician-001")
  const [role, setRole] = useState("clinician")
  const [name, setName] = useState("Demo Clinician")
  const [token, setTok] = useState<string | null>(null)

  useEffect(() => {
    setTok(getToken())
  }, [])

  async function login() {
    const r = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role, name }),
    })
    const j = await r.json()
    if (j.token) {
      setToken(j.token)
      setTok(j.token)
    }
  }

  function logout() {
    clearToken()
    setTok(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty text-lg">ABHA OAuth (Demo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user id"
            aria-label="User ID"
          />
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="role" aria-label="Role" />
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" aria-label="Name" />
        </div>
        <div className="flex gap-2">
          <Button onClick={login} className="bg-primary text-primary-foreground hover:opacity-90">
            Login (demo)
          </Button>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">JWT</div>
          <Textarea readOnly value={token || ""} className="h-20" />
        </div>
      </CardContent>
    </Card>
  )
}
