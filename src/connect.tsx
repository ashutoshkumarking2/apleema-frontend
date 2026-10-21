import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GithubAuthProvider, signInWithPopup, signOut, type OAuthCredential } from "firebase/auth"
import type { FirebaseError } from "firebase/app"
import { toast } from "sonner"
import { auth, ghAuth } from "./firebase"
import { api } from "./api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Status = { github: boolean; githubLogin: string | null; vercel: boolean }

export default function Connect() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [status, setStatus] = useState<Status | null>(null)

  const load = () =>
    api.get("/api/status").then(setStatus).catch((e) => toast.error(e.message))

  useEffect(() => {
    load()
    const err = params.get("error")
    if (err) toast.error(err)
    if (params.get("vercel") === "ok") toast.success("Vercel connected")
  }, [params])

  async function connectGithub() {
    const p = new GithubAuthProvider()
    p.addScope("repo")
    p.setCustomParameters({ prompt: "select_account" })
    try {
      let cred: OAuthCredential | null = null
      try {
        cred = GithubAuthProvider.credentialFromResult(await signInWithPopup(ghAuth, p))
      } catch (e) {
        // Same-email conflicts still carry the GitHub token; use it
        cred = GithubAuthProvider.credentialFromError(e as FirebaseError)
        if (!cred) throw e
      } finally {
        await signOut(ghAuth).catch(() => {})
      }
      if (!cred?.accessToken) throw new Error("GitHub token not received")
      await api.post("/api/github/token", { token: cred.accessToken })
      toast.success("GitHub connected")
      load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function connectVercel() {
    try {
      const { url } = await api.post("/api/vercel/start")
      window.location.href = url
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const steps = [
    {
      title: "1. Sign in",
      desc: auth.currentUser?.email || "Signed in",
      done: true,
      action: null as null | { label: string; run: () => void; disabled?: boolean },
    },
    {
      title: "2. Connect GitHub",
      desc: status?.githubLogin ? `@${status.githubLogin}` : "Access your repositories",
      done: !!status?.github,
      action: { label: status?.github ? "Reconnect" : "Connect GitHub", run: connectGithub },
    },
    {
      title: "3. Connect Vercel",
      desc: "Import and deploy from Vercel",
      done: !!status?.vercel,
      action: {
        label: status?.vercel ? "Reconnect" : "Connect Vercel",
        run: connectVercel,
        disabled: !status?.github,
      },
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Connect your accounts</h1>
      {steps.map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </div>
            <Badge variant={s.done ? "default" : "secondary"}>{s.done ? "Done" : "Pending"}</Badge>
          </CardHeader>
          {s.action && (
            <CardContent>
              <Button variant={s.done ? "outline" : "default"} disabled={s.action.disabled} onClick={s.action.run}>
                {s.action.label}
              </Button>
            </CardContent>
          )}
        </Card>
      ))}
      {status?.github && status?.vercel && (
        <Button onClick={() => nav("/repos")}>Continue to repositories</Button>
      )}
    </div>
  )
}