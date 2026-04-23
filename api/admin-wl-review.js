import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function parseLeadershipRoles() {
  return (process.env.DISCORD_LEADERSHIP_ROLE_IDS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

function getDiscordUserIdFromSupabaseUser(user) {
  if (!user) return null

  const meta = user.user_metadata || {}
  const identities = user.identities || []

  const discordIdentity = identities.find((i) => i.provider === "discord")

  return (
    meta.provider_id ||
    meta.sub ||
    discordIdentity?.id ||
    discordIdentity?.identity_data?.provider_id ||
    discordIdentity?.identity_data?.sub ||
    null
  )
}

async function getSupabaseUserFromAccessToken(accessToken) {
  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data?.user) {
    throw new Error("Nepodařilo se ověřit přihlášeného uživatele.")
  }

  return data.user
}

async function getGuildMember(discordUserId) {
  const guildId = process.env.DISCORD_GUILD_ID
  const botToken = process.env.DISCORD_BOT_TOKEN

  const res = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${discordUserId}`,
    {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Nepodařilo se načíst Discord membera. ${res.status} ${text}`)
  }

  return await res.json()
}

function hasLeadershipRole(member) {
  const allowedRoles = parseLeadershipRoles()
  const memberRoles = member.roles || []
  return memberRoles.some((roleId) => allowedRoles.includes(roleId))
}

async function addRole(discordUserId, roleId) {
  const guildId = process.env.DISCORD_GUILD_ID
  const botToken = process.env.DISCORD_BOT_TOKEN

  const res = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Nepodařilo se přidat roli ${roleId}. ${res.status} ${text}`)
  }
}

async function removeRole(discordUserId, roleId) {
  const guildId = process.env.DISCORD_GUILD_ID
  const botToken = process.env.DISCORD_BOT_TOKEN

  const res = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    }
  )

  if (!res.ok && res.status !== 404) {
    const text = await res.text()
    throw new Error(`Nepodařilo se odebrat roli ${roleId}. ${res.status} ${text}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const authHeader = req.headers.authorization || ""
    const accessToken = authHeader.replace("Bearer ", "").trim()

    if (!accessToken) {
      return res.status(401).json({ error: "Chybí access token." })
    }

    const reviewerUser = await getSupabaseUserFromAccessToken(accessToken)
    const reviewerDiscordId = getDiscordUserIdFromSupabaseUser(reviewerUser)

    if (!reviewerDiscordId) {
      return res.status(400).json({ error: "Nepodařilo se získat Discord ID reviewera." })
    }

    const reviewerMember = await getGuildMember(reviewerDiscordId)

    if (!hasLeadershipRole(reviewerMember)) {
      return res.status(403).json({ error: "Nemáš oprávnění." })
    }

    const { applicationId, action, reviewNote } = req.body || {}

    if (!applicationId || !action) {
      return res.status(400).json({ error: "Chybí applicationId nebo action." })
    }

    if (!["approved", "denied"].includes(action)) {
      return res.status(400).json({ error: "Neplatná akce." })
    }

    const { data: application, error: appError } = await supabase
      .from("wl_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (appError || !application) {
      return res.status(404).json({ error: "Žádost nebyla nalezena." })
    }

    const reviewedAt = new Date().toISOString()

    const { error: updateAppError } = await supabase
      .from("wl_applications")
      .update({
        status: action,
        reviewed_by_discord_id: reviewerDiscordId,
        review_note: reviewNote || null,
        reviewed_at: reviewedAt,
      })
      .eq("id", applicationId)

    if (updateAppError) {
      return res.status(500).json({ error: updateAppError.message })
    }

    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        wl_status: action,
      })
      .eq("discord_id", application.discord_id)

    if (updateUserError) {
      return res.status(500).json({ error: updateUserError.message })
    }

    if (action === "approved") {
      const awaitingRoleId = process.env.DISCORD_AWAITING_ROLE_ID
      const allowlistRoleId = process.env.DISCORD_ALLOWLIST_ROLE_ID

      if (awaitingRoleId) {
        await removeRole(application.discord_id, awaitingRoleId)
      }

      if (allowlistRoleId) {
        await addRole(application.discord_id, allowlistRoleId)
      }
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error." })
  }
}