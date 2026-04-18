import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"

export default function AdminWhitelist() {
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [applications, setApplications] = useState([])
  const [error, setError] = useState("")
  const [reviewNotes, setReviewNotes] = useState({})

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError("")

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        setError("Nejsi přihlášený.")
        setLoading(false)
        return
      }

      const res = await fetch("/api/admin-wl-list", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Nepodařilo se načíst žádosti.")
      }

      setApplications(json.applications || [])
    } catch (e) {
      setError(e.message || "Chyba.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleReview = async (applicationId, action) => {
    try {
      setSubmittingId(applicationId)
      setError("")

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error("Nejsi přihlášený.")
      }

      const res = await fetch("/api/admin-wl-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          applicationId,
          action,
          reviewNote: reviewNotes[applicationId] || "",
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Nepodařilo se zpracovat žádost.")
      }

      await loadApplications()
    } catch (e) {
      setError(e.message || "Chyba.")
    } finally {
      setSubmittingId(null)
    }
  }

  const setNote = (id, value) => {
    setReviewNotes((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Admin WL panel</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-6">
            Načítám žádosti...
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-6">
            Žádné WL žádosti.
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">Discord ID: {app.discord_id}</div>
                    <div className="text-sm text-white/60">
                      Odesláno: {new Date(app.created_at).toLocaleString("cs-CZ")}
                    </div>
                  </div>

                  <div className="text-sm">
                    Status: <span className="font-semibold">{app.status}</span>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-4 text-sm">
                  <Field label="Steam profil" value={app.steam_url} />
                  <Field label="Věk" value={app.age} />
                  <Field label="RP hodiny" value={app.rp_hours} />
                  <Field label="Jak ses dozvěděl o serveru?" value={app.source_found} />
                  <Field label="RP" value={app.answer_rp} textarea />
                  <Field label="OOC a IC" value={app.answer_ooc_ic} textarea />
                  <Field label="/me a /do" value={app.answer_me_do} textarea />
                  <Field label="CK" value={app.answer_ck} textarea />
                  <Field label="KOS" value={app.answer_kos} textarea />
                  <Field label="Loot" value={app.answer_loot} textarea />
                  <Field label="Scénář 1" value={app.scenario_1} textarea />
                  <Field label="Scénář 2" value={app.scenario_2} textarea />
                </div>

                <div className="px-5 pb-5">
                  <textarea
                    className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 min-h-[100px]"
                    placeholder="Poznámka k rozhodnutí (volitelné)"
                    value={reviewNotes[app.id] || ""}
                    onChange={(e) => setNote(app.id, e.target.value)}
                  />

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      disabled={submittingId === app.id}
                      onClick={() => handleReview(app.id, "approved")}
                      className="rounded-xl bg-green-600 hover:bg-green-500 px-4 py-2 font-semibold disabled:opacity-50"
                    >
                      {submittingId === app.id ? "Zpracovávám..." : "Schválit"}
                    </button>

                    <button
                      disabled={submittingId === app.id}
                      onClick={() => handleReview(app.id, "denied")}
                      className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 font-semibold disabled:opacity-50"
                    >
                      {submittingId === app.id ? "Zpracovávám..." : "Zamítnout"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, textarea = false }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
      <div className="text-white/50 mb-2">{label}</div>
      <div className={textarea ? "whitespace-pre-wrap break-words" : "break-all"}>
        {value || "-"}
      </div>
    </div>
  )
}