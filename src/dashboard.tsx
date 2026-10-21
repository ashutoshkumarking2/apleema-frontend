import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { api } from "./api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Project = { id: string; name: string }

export default function Dashboard() {
  const nav = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .get("/api/status")
      .then(async (s) => {
        if (!s.github || !s.vercel) return nav("/connect", { replace: true })
        setProjects(await api.get("/api/vercel/projects"))
        setReady(true)
      })
      .catch((e) => toast.error(e.message))
  }, [nav])

  if (!ready) return <p className="text-muted-foreground">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Deployed projects</CardDescription>
            <CardTitle className="text-4xl">{projects.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => nav("/projects")}>View projects</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deploy a new project</CardTitle>
            <CardDescription>Pick a GitHub repo and deploy it on Vercel.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => nav("/repos")}>Import repository</Button>
            <Button variant="outline" onClick={() => nav("/domains")}>Manage domains</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}