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
  const { name, value } = e.target

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }))

  // 🔥 FIX: drží scroll na aktuálním inputu
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }, 0)
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

    const { error: userUpsertError } = await supabase.from("users").upsert(
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

  const inputClass =
    "w-full rounded-xl bg-zinc-950/70 border border-white/20 px-4 py-4 text-white placeholder-white/40 outline-none focus:border-red-500 transition"

  const textareaClass = `${inputClass} min-h-[120px] resize-y`

  const Field = ({ label, required = true, children }) => (
    <div className="space-y-3">
      <label className="block text-lg font-bold leading-snug">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )

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
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/90 p-8 md:p-10 shadow-2xl">
          <h1 className="text-4xl font-black mb-10">Žádost o WL</h1>

          {wlStatus === "denied" && (
            <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Tvoje předchozí WL žádost byla zamítnuta. Můžeš vyplnit novou.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Field label="Odkaz na Steam Profil">
              <input
                className={inputClass}
                type="text"
                name="steam_url"
                value={form.steam_url}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Kolik je ti let?">
              <input
                className={inputClass}
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Kolik máš naRPeno hodin (kde jsi už RPil)?">
              <input
                className={inputClass}
                type="text"
                name="rp_hours"
                value={form.rp_hours}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Jak by jsi vysvětlil svými slovy RP?">
              <textarea
                className={textareaClass}
                name="answer_rp"
                value={form.answer_rp}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Co je OOC a IC?">
              <textarea
                className={textareaClass}
                name="answer_ooc_ic"
                value={form.answer_ooc_ic}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Vysvětli /me a /do">
              <input
                className={inputClass}
                type="text"
                name="answer_me_do"
                value={form.answer_me_do}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Pravidlo CK">
              <input
                className={inputClass}
                type="text"
                name="answer_ck"
                value={form.answer_ck}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Co je to KOS?">
              <input
                className={inputClass}
                type="text"
                name="answer_kos"
                value={form.answer_kos}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="O co všechno tě může zloděj okrást?">
              <input
                className={inputClass}
                type="text"
                name="answer_loot"
                value={form.answer_loot}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Vytvořím si postavu jménem Pepa Novák. Po spawnu na letišti ukradnu auto a začnou mě nahánět policisté. Já jim uteču a odpojím. Byla nějaká pravidla porušena? Jaká? Zdůvodni:">
              <textarea
                className={`${textareaClass} min-h-[140px]`}
                name="scenario_1"
                value={form.scenario_1}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Vykradli jste s kamarádem banku, nasedli jste do sporťáku a teď ujíždíte policii. Po cestě nabouráte do stromu, sjedete ze srázu a vyrazíte do hor. Byla nějaká pravidla porušena? Jaká? Vysvětli:">
              <textarea
                className={`${textareaClass} min-h-[140px]`}
                name="scenario_2"
                value={form.scenario_2}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Jak ses o serveru dozvěděl?">
              <select
                className={inputClass}
                name="source_found"
                value={form.source_found}
                onChange={handleChange}
                required
              >
                <option value="">Vyber možnost...</option>
                <option value="TikTok">TikTok</option>
                <option value="Discord">Discord</option>
                <option value="Kamarád">Kamarád</option>
                <option value="YouTube">YouTube</option>
                <option value="Jiné">Jiné</option>
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-sky-300 hover:bg-sky-200 text-black px-6 py-4 font-black tracking-[0.2em] transition disabled:opacity-50"
            >
              {loading ? "ODESÍLÁM..." : "ODESLAT ŽÁDOST"}
            </button>

            {message && (
              <div className="rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}