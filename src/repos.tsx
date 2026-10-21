import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { api } from "./api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type Repo = {
  id: number
  full_name: string
  name: string
  private: boolean
  branch: string
  description: string | null
  language: string | null
}

export default function Repos() {
  const nav = useNavigate()
  const [repos, setRepos] = useState<Repo[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/api/github/repos")
      .then(setRepos)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const list = repos.filter((r) => r.full_name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Repositories</h1>
      <Input placeholder="Search repositories" value={q} onChange={(e) => setQ(e.target.value)} />
      {loading && <p className="text-muted-foreground">Loading…</p>}
      {list.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-medium">{r.full_name}</span>
                <Badge variant="secondary">{r.private ? "Private" : "Public"}</Badge>
                {r.language && <Badge variant="outline">{r.language}</Badge>}
              </div>
              {r.description && <p className="truncate text-sm text-muted-foreground">{r.description}</p>}
            </div>
            <Button
              onClick={() =>
                nav(`/import?repo=${encodeURIComponent(r.full_name)}&id=${r.id}&branch=${encodeURIComponent(r.branch)}`)
              }
            >
              Import
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}