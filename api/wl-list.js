import { json, requireLeadership } from "./_helpers.js"

export default async function handler(request) {
  try {
    const { error, supabase } = await requireLeadership(request)
    if (error) return error

    const { data, error: dbError } = await supabase
      .from("wl_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      return json(500, { error: dbError.message })
    }

    return json(200, { items: data || [] })
  } catch (err) {
    return json(500, { error: err.message || "Neznámá chyba" })
  }
}
