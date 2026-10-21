import { Route, Routes, useLocation } from "react-router-dom"
import App from "./App"
import { Docs, LegalLinks, Privacy, Support, Terms } from "./Legal"

export default function Site() {
  const { pathname } = useLocation()
  return (
    <>
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<App />} />
      </Routes>
      {pathname === "/login" && <LegalLinks floating />}
    </>
  )
}