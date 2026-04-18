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

async function getDiscordUser(accessToken) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error("Nepodařilo se načíst Discord usera.")
  }

  return await res.json()
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
    throw new Error("Nepodařilo se načíst Discord membera.")
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

    const discordUser = await getDiscordUser(accessToken)
    const member = await getGuildMember(discordUser.id)

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