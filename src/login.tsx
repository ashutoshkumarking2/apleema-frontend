import { useEffect, useState, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { toast } from "sonner"
import { auth } from "./firebase"
import { api, API_URL } from "./api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Login() {
  const [params] = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signup, setSignup] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const token = params.get("token")
    const error = params.get("error")
    if (error) toast.error(error)
    if (token) signInWithCustomToken(auth, token).catch((e) => toast.error(e.message))
  }, [params])

  async function run(fn: () => Promise<void>) {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      const err = e as { code?: string; message: string }
      toast.error(
        err.code === "auth/account-exists-with-different-credential"
          ? "This email already uses another login. Sign in with that first, then connect GitHub from the Connect page."
          : err.message
      )
    } finally {
      setBusy(false)
    }
  }

  const google = () => run(async () => void (await signInWithPopup(auth, new GoogleAuthProvider())))

  const github = () =>
    run(async () => {
      const p = new GithubAuthProvider()
      p.addScope("repo")
      const r = await signInWithPopup(auth, p)
      const cred = GithubAuthProvider.credentialFromResult(r)
      if (cred?.accessToken) await api.post("/api/github/token", { token: cred.accessToken })
    })

  const vercel = () => {
    window.location.href = `${API_URL}/api/vercel/login`
  }

  const emailAuth = (e: FormEvent) => {
    e.preventDefault()
    run(async () => {
      if (signup) await createUserWithEmailAndPassword(auth, email, password)
      else await signInWithEmailAndPassword(auth, email, password)
    })
  }

  return (
    <div className="grid min-h-svh place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Avatar className="size-16">
            <AvatarImage src="/apleemaofficial.png" alt="Apleema" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Welcome to Apleema</CardTitle>
          <CardDescription>Deploy from GitHub to Vercel in minutes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button variant="outline" disabled={busy} onClick={google}>Continue with Google</Button>
          <Button variant="outline" disabled={busy} onClick={github}>Continue with GitHub</Button>
          <Button variant="outline" disabled={busy} onClick={vercel}>Continue with Vercel</Button>
          <div className="my-1 text-center text-xs text-muted-foreground">or use email</div>
          <form onSubmit={emailAuth} className="flex flex-col gap-3">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <Button type="submit" disabled={busy}>{signup ? "Create account" : "Sign in"}</Button>
          </form>
          <Button variant="link" onClick={() => setSignup(!signup)}>
            {signup ? "Already have an account? Sign in" : "New here? Create an account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}