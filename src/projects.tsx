import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { api } from "./api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Project = { id: string; name: string; repo: string | null; url: string | null }

export default function Projects() {
  const nav = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/api/vercel/projects")
      .then(setProjects)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      {loading && <p className="text-muted-foreground">Loading…</p>}
      {!loading && projects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
      {projects.map((p) => (
        <Card key={p.id}>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium">{p.name}</p>
              <p className="truncate text-sm text-muted-foreground">{p.repo || "No repository"}</p>
            </div>
            <div className="flex gap-2">
              {p.url && (
                <Button asChild variant="outline">
                  <a href={`https://${p.url}`} target="_blank" rel="noreferrer">Open</a>
                </Button>
              )}
              <Button onClick={() => nav(`/domains?project=${p.id}`)}>Add domain</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}