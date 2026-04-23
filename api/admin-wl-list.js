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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const authHeader = req.headers.authorization || ""
    const accessToken = authHeader.replace("Bearer ", "").trim()

    if (!accessToken) {
      return res.status(401).json({ error: "Chybí access token." })
    }

    const user = await getSupabaseUserFromAccessToken(accessToken)
    const discordUserId = getDiscordUserIdFromSupabaseUser(user)

    if (!discordUserId) {
      return res.status(400).json({ error: "Nepodařilo se získat Discord ID uživatele." })
    }

    const member = await getGuildMember(discordUserId)

    if (!hasLeadershipRole(member)) {
      return res.status(403).json({ error: "Nemáš oprávnění." })
    }

    const { data, error } = await supabase
      .from("wl_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ applications: data || [] })
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error." })
  }
}