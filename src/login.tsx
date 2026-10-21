import { useEffect, useState, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { toast } from "sonner"
import { auth } from "./firebase"
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
          ? "This email is already registered with another login. Sign in with Google first."
          : err.message
      )
    } finally {
      setBusy(false)
    }
  }

  const google = () => run(async () => void (await signInWithPopup(auth, new GoogleAuthProvider())))

  // GitHub and Vercel are connected after signing in with Google
  const needGoogle = (what: string) => {
    toast.info(`First sign in with Google. Then connect ${what} from the Connect page.`)
    google()
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
          <Button variant="outline" disabled={busy} onClick={() => needGoogle("GitHub")}>Continue with GitHub</Button>
          <Button variant="outline" disabled={busy} onClick={() => needGoogle("Vercel")}>Continue with Vercel</Button>
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