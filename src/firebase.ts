import { initializeApp } from "firebase/app"
import { browserPopupRedirectResolver, getAuth, inMemoryPersistence, initializeAuth } from "firebase/auth"

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const auth = getAuth(initializeApp(config))

// Separate in-memory auth, used only to fetch a GitHub token without touching the signed-in user
export const ghAuth = initializeAuth(initializeApp(config, "github-connect"), {
  persistence: inMemoryPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
})