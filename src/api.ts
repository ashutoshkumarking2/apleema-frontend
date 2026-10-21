import { auth } from "./firebase"

export const API_URL: string = import.meta.env.VITE_API_URL

async function call(method: string, path: string, body?: unknown) {
  const user = auth.currentUser
  const token = await user?.getIdToken()

  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Request failed")
  return data
}

export const api = {
  get: (p: string) => call("GET", p),
  post: (p: string, b?: unknown) => call("POST", p, b),
  del: (p: string, b?: unknown) => call("DELETE", p, b),
}
