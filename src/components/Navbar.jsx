import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "../lib/supabase"
import logo from "@/assets/logo.png"

const LINKS = {
  DISCORD: "https://discord.gg/elevatefivem",
  CONNECT: "fivem://connect/146.59.73.118:30036",
  TIKTOK: "https://www.tiktok.com/@elevateeu_fivem?lang=cs-CZ",
  YT: "https://www.youtube.com/@Elevatefivemrp",
}

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const linkCls = ({ isActive }) =>
    "hover:text-white/80 " + (isActive ? "text-white" : "text-white/80")

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ElevateRP" className="w-8 h-8 object-contain" />
          <span className="font-bold tracking-tight">ElevateRP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={linkCls} end>
            Domů
          </NavLink>

          <a href="#vip" className="text-white/80 hover:text-white">
            VIP
          </a>

          <NavLink to="/pravidla" className={linkCls}>
            Pravidla
          </NavLink>

          {user && (
            <NavLink to="/whitelist" className={linkCls}>
              Žádost o WL
            </NavLink>
          )}

          <a
            href={LINKS.DISCORD}
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white"
          >
            Discord
          </a>

          <a
            href={LINKS.TIKTOK}
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white"
          >
            TikTok
          </a>

          <a
            href={LINKS.YT}
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white"
          >
            YouTube
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="secondary" className="rounded-2xl" onClick={login}>
                Přihlásit přes Discord
              </Button>

              <a href={LINKS.CONNECT}>
                <Button className="rounded-2xl">Připojit</Button>
              </a>
            </>
          ) : (
            <>
              <span className="text-sm text-white/80 hidden md:block">
                {user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  "Přihlášený uživatel"}
              </span>

              <Link to="/profile">
                <Button variant="secondary" className="rounded-2xl">
                  Profil
                </Button>
              </Link>

              <Button className="rounded-2xl" onClick={logout}>
                Odhlásit
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}