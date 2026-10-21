import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { api } from "./api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Import() {
  const nav = useNavigate()
  const [p] = useSearchParams()
  const repo = p.get("repo") || ""
  const repoId = p.get("id") || ""
  const [name, setName] = useState(
    (repo.split("/")[1] || "").toLowerCase().replace(/[^a-z0-9-]/g, "-")
  )
  const [branch, setBranch] = useState(p.get("branch") || "main")
  const [busy, setBusy] = useState(false)

  async function deploy() {
    setBusy(true)
    try {
      const d = await api.post("/api/vercel/deploy", { repo, repoId, branch, name })
      toast.success("Deployment started")
      nav(`/domains?project=${d.projectId}&new=1`)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (!repo)
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground">No repository selected.</p>
        <Button onClick={() => nav("/repos")}>Choose a repository</Button>
      </div>
    )

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Import {repo}</CardTitle>
        <CardDescription>Creates a Vercel project and deploys it to production.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input value={name} onChange={(e) => setName(e.target.value.toLowerCase())} placeholder="Project name" />
        <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch" />
        <Button disabled={busy || !name} onClick={deploy}>
          {busy ? "Deploying…" : "Deploy"}
        </Button>
      </CardContent>
    </Card>
  )
}