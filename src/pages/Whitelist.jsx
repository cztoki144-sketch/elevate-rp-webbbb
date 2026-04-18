import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function Whitelist() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    steam_url: "",
    age: "",
    rp_hours: "",
    answer_rp: "",
    answer_ooc_ic: "",
    answer_me_do: "",
    answer_ck: "",
    answer_kos: "",
    answer_loot: "",
    scenario_1: "",
    scenario_2: "",
    source_found: "",
  })

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [message, setMessage] = useState("")
  const [user, setUser] = useState(null)
  const [wlStatus, setWlStatus] = useState(null)

  useEffect(() => {
    const loadAccess = async () => {
      setChecking(true)

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      setUser(authUser)

      if (!authUser) {
        setChecking(false)
        return
      }

      const discordId =
        authUser.user_metadata?.provider_id ||
        authUser.user_metadata?.sub ||
        authUser.id

      const { data: profile } = await supabase
        .from("users")
        .select("wl_status")
        .eq("discord_id", discordId)
        .maybeSingle()

      setWlStatus(profile?.wl_status || "none")
      setChecking(false)
    }

    loadAccess()
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !authUser) {
      setMessage("Nejsi přihlášený přes Discord.")
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
      "Unknown"

    const discordAvatar = authUser.user_metadata?.avatar_url || null

    const { data: existingProfile } = await supabase
      .from("users")
      .select("wl_status")
      .eq("discord_id", discordId)
      .maybeSingle()

    if (
      existingProfile?.wl_status === "pending" ||
      existingProfile?.wl_status === "approved"
    ) {
      setMessage("Žádost už máš odeslanou nebo schválenou.")
      setLoading(false)
      return
    }

    const { error: userUpsertError } = await supabase
      .from("users")
      .upsert(
        {
          discord_id: discordId,
          discord_username: discordUsername,
          discord_avatar: discordAvatar,
          wl_status: "pending",
        },
        { onConflict: "discord_id" }
      )

    if (userUpsertError) {
      setMessage("Chyba při ukládání uživatele.")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("wl_applications").insert({
      discord_id: discordId,
      steam_url: form.steam_url,
      age: form.age,
      rp_hours: form.rp_hours,
      answer_rp: form.answer_rp,
      answer_ooc_ic: form.answer_ooc_ic,
      answer_me_do: form.answer_me_do,
      answer_ck: form.answer_ck,
      answer_kos: form.answer_kos,
      answer_loot: form.answer_loot,
      scenario_1: form.scenario_1,
      scenario_2: form.scenario_2,
      source_found: form.source_found,
      status: "pending",
    })

    if (insertError) {
      setMessage("Chyba při odesílání WL žádosti.")
      setLoading(false)
      return
    }

    setMessage("Žádost byla úspěšně odeslána.")
    setLoading(false)

    setTimeout(() => {
      navigate("/", { replace: true })
    }, 1200)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Načítám...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (wlStatus === "pending") {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h1 className="text-2xl font-bold">Žádost už byla odeslána</h1>
            </div>
            <div className="p-5 space-y-4 text-white/80">
              <p>Tvoje WL žádost už čeká na schválení.</p>
              <button
                onClick={() => navigate("/profile")}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 font-semibold"
              >
                Přejít na profil
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (wlStatus === "approved") {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h1 className="text-2xl font-bold">Whitelist už máš schválený</h1>
            </div>
            <div className="p-5 space-y-4 text-white/80">
              <p>Novou WL žádost už vyplňovat nemusíš.</p>
              <button
                onClick={() => navigate("/profile")}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 font-semibold"
              >
                Přejít na profil
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Žádost o WL</h1>

        {wlStatus === "denied" && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Tvoje předchozí WL žádost byla zamítnuta. Můžeš vyplnit novou.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3"
            type="text"
            name="steam_url"
            placeholder="Odkaz na Steam profil"
            value={form.steam_url}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3"
            type="text"
            name="age"
            placeholder="Kolik ti je let?"
            value={form.age}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3"
            type="text"
            name="rp_hours"
            placeholder="Kolik máš nahráno RP hodin?"
            value={form.rp_hours}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_rp"
            placeholder="Jak bys vysvětlil svými slovy RP?"
            value={form.answer_rp}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_ooc_ic"
            placeholder="Co je OOC a IC?"
            value={form.answer_ooc_ic}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_me_do"
            placeholder="Vysvětli /me a /do"
            value={form.answer_me_do}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_ck"
            placeholder="Co je CK?"
            value={form.answer_ck}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_kos"
            placeholder="Co je KOS?"
            value={form.answer_kos}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[120px]"
            name="answer_loot"
            placeholder="O co všechno tě může zloděj okrást?"
            value={form.answer_loot}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[140px]"
            name="scenario_1"
            placeholder="Scénář 1"
            value={form.scenario_1}
            onChange={handleChange}
            required
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 min-h-[140px]"
            name="scenario_2"
            placeholder="Scénář 2"
            value={form.scenario_2}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3"
            type="text"
            name="source_found"
            placeholder="Jak ses o serveru dozvěděl?"
            value={form.source_found}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 hover:bg-red-500 px-4 py-3 font-semibold"
          >
            {loading ? "Odesílám..." : "Odeslat žádost"}
          </button>

          {message && (
            <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}