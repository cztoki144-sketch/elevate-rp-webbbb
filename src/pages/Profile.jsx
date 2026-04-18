import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"

function StatusBadge({ status }) {
  const map = {
    none: { label: "Bez whitelistu", cls: "bg-white/10 text-white/80" },
    pending: { label: "Čeká na schválení", cls: "bg-yellow-500/15 text-yellow-300" },
    approved: { label: "Whitelist schválen", cls: "bg-green-500/15 text-green-300" },
    denied: { label: "Whitelist zamítnut", cls: "bg-red-500/15 text-red-300" },
  }
  const item = map[status] || map.none
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm ${item.cls}`}>{item.label}</span>
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [latestApplication, setLatestApplication] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      setUser(authUser)

      if (!authUser) {
        setProfile(null)
        setLatestApplication(null)
        setLoading(false)
        return
      }

      const discordId =
        authUser.user_metadata?.provider_id ||
        authUser.user_metadata?.sub ||
        authUser.id

      const discordUsername =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email ||
        "Uživatel"

      const discordAvatar = authUser.user_metadata?.avatar_url || null

      const { data: syncedProfile } = await supabase
        .from("users")
        .upsert(
          {
            discord_id: discordId,
            discord_username: discordUsername,
            discord_avatar: discordAvatar,
          },
          { onConflict: "discord_id" }
        )
        .select()
        .single()

      const { data: applicationData } = await supabase
        .from("wl_applications")
        .select("*")
        .eq("discord_id", discordId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      setProfile(syncedProfile || null)
      setLatestApplication(applicationData || null)
      setLoading(false)
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const displayName = useMemo(() => {
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email ||
      "Uživatel"
    )
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Můj profil</h1>
          <p className="text-white/70 mt-2">Tady uvidíš stav WL a poslední odeslanou žádost.</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">Načítám profil…</CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Nejsi přihlášený</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white/80">
              <p>Nejdřív se přihlas přes Discord.</p>
              <Link to="/login">
                <Button className="rounded-2xl">Přejít na přihlášení</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white/80">
                <div>
                  <strong>Discord ID:</strong> {profile?.discord_id || "Nenalezeno"}
                </div>
                <div className="flex items-center gap-3">
                  <strong>Whitelist status:</strong>{" "}
                  <StatusBadge status={profile?.wl_status || "none"} />
                </div>
                <div>
                  <strong>Vytvořeno:</strong>{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleString("cs-CZ")
                    : "-"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Poslední WL žádost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white/80">
                {!latestApplication ? (
                  <>
                    <p>Zatím nemáš žádnou odeslanou žádost.</p>
                    <Link to="/whitelist">
                      <Button className="rounded-2xl">Vyplnit WL žádost</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>Stav žádosti:</strong> {latestApplication.status}
                    </div>
                    <div>
                      <strong>Odesláno:</strong>{" "}
                      {new Date(latestApplication.created_at).toLocaleString("cs-CZ")}
                    </div>
                    {latestApplication.review_note && (
                      <div>
                        <strong>Poznámka vedení:</strong> {latestApplication.review_note}
                      </div>
                    )}
                    <Link to="/whitelist">
                      <Button variant="secondary" className="rounded-2xl">
                        Otevřít formulář znovu
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}