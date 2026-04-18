import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState("Dokončuji přihlášení přes Discord...")

  useEffect(() => {
    const finishLogin = async () => {
      try {
        const hash = window.location.hash.startsWith("#")
          ? new URLSearchParams(window.location.hash.slice(1))
          : null

        const access_token = hash?.get("access_token")
        const refresh_token = hash?.get("refresh_token")

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (error) {
            setMessage("Nepodařilo se uložit session.")
            return
          }

          window.history.replaceState({}, document.title, "/auth/callback")
          navigate("/profile", { replace: true })
          return
        }

        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

          if (error) {
            setMessage("Nepodařilo se dokončit OAuth přihlášení.")
            return
          }

          window.history.replaceState({}, document.title, "/auth/callback")
          navigate("/profile", { replace: true })
          return
        }

        setMessage("Chybí OAuth token nebo code.")
      } catch (e) {
        setMessage("Chyba při dokončování přihlášení.")
      }
    }

    finishLogin()
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900 px-6 py-5 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-3">Discord přihlášení</h1>
        <p className="text-white/70">{message}</p>
      </div>
    </div>
  )
}