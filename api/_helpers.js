import { createClient } from "@supabase/supabase-js"

export function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function getServerSupabase() {
  const url = process.env.SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    throw new Error("Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY")
  }
  return createClient(url, serviceRole)
}

export async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token) return null

  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Chybí SUPABASE_URL nebo SUPABASE_ANON_KEY")
  }

  const client = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token)

  if (error || !user) return null
  return user
}

export async function requireLeadership(request) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return { error: json(401, { error: "Nejsi přihlášený." }) }
  }

  const supabase = getServerSupabase()
  const { data: dbUser } = await supabase
    .from("users")
    .select("discord_user_id")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (!dbUser?.discord_user_id) {
    return { error: json(403, { error: "Uživatel není synchronizovaný s Discord ID." }) }
  }

  const guildId = process.env.DISCORD_GUILD_ID
  const botToken = process.env.DISCORD_BOT_TOKEN
  const leadership = (process.env.DISCORD_LEADERSHIP_ROLE_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  if (!guildId || !botToken || leadership.length === 0) {
    return { error: json(500, { error: "Chybí Discord env proměnné pro vedení." }) }
  }

  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${dbUser.discord_user_id}`, {
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    return { error: json(403, { error: "Nepovedlo se ověřit role vedení na Discordu." }) }
  }

  const member = await response.json()
  const memberRoles = member.roles || []
  const isAllowed = leadership.some((roleId) => memberRoles.includes(roleId))

  if (!isAllowed) {
    return { error: json(403, { error: "Nemáš oprávnění pro WL schvalování." }) }
  }

  return { user, supabase, dbUser }
}
