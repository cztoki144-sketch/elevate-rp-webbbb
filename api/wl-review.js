import { json, requireLeadership } from "./_helpers.js"

async function addRole(guildId, userId, roleId, botToken) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error(`Nepodařilo se přidat roli ${roleId}`)
  }
}

async function removeRole(guildId, userId, roleId, botToken) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok && response.status !== 404) {
    throw new Error(`Nepodařilo se odebrat roli ${roleId}`)
  }
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" })
  }

  try {
    const { error, user, supabase } = await requireLeadership(request)
    if (error) return error

    const body = await request.json()
    const { applicationId, action, note = "" } = body || {}

    if (!applicationId || !["approve", "deny"].includes(action)) {
      return json(400, { error: "Chybí applicationId nebo action." })
    }

    const { data: application, error: applicationError } = await supabase
      .from("wl_applications")
      .select("*")
      .eq("id", applicationId)
      .maybeSingle()

    if (applicationError || !application) {
      return json(404, { error: "Žádost nebyla nalezena." })
    }

    const nextStatus = action === "approve" ? "approved" : "denied"

    const { error: updateAppError } = await supabase
      .from("wl_applications")
      .update({
        status: nextStatus,
        reviewed_at: new Date().toISOString(),
        reviewer_discord_id: application.discord_user_id,
        review_note: note,
      })
      .eq("id", applicationId)

    if (updateAppError) {
      return json(500, { error: updateAppError.message })
    }

    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        wl_status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", application.auth_user_id)

    if (updateUserError) {
      return json(500, { error: updateUserError.message })
    }

    if (action === "approve") {
      const guildId = process.env.DISCORD_GUILD_ID
      const botToken = process.env.DISCORD_BOT_TOKEN
      const awaitingRoleId = process.env.DISCORD_AWAITING_ROLE_ID
      const allowlistRoleId = process.env.DISCORD_ALLOWLIST_ROLE_ID

      if (!guildId || !botToken || !awaitingRoleId || !allowlistRoleId) {
        return json(500, { error: "Chybí Discord env proměnné pro role." })
      }

      await removeRole(guildId, application.discord_user_id, awaitingRoleId, botToken)
      await addRole(guildId, application.discord_user_id, allowlistRoleId, botToken)
    }

    return json(200, { ok: true, reviewedBy: user.id, status: nextStatus })
  } catch (err) {
    return json(500, { error: err.message || "Neznámá chyba" })
  }
}
