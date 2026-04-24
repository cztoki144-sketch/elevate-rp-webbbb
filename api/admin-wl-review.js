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
  const identities = user?.identities || []
  const discordIdentity = identities.find((i) => i.provider === "discord")
  const meta = user?.user_metadata || {}

  return (
    discordIdentity?.identity_data?.provider_id ||
    discordIdentity?.identity_data?.sub ||
    discordIdentity?.id ||
    meta.provider_id ||
    meta.sub ||
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
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Discord member error ${res.status}: ${text}`)
  }

  return await res.json()
}

function hasLeadershipRole(member) {
  const allowedRoles = parseLeadershipRoles()
  const memberRoles = member?.roles || []

  return memberRoles.some((roleId) => allowedRoles.includes(roleId))
}

async function addRole(discordUserId, roleId) {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Discord add role error ${res.status}: ${text}`)
  }
}

async function sendDiscordDM(discordUserId, message) {
  const botToken = process.env.DISCORD_BOT_TOKEN

  const channelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
    method: "POST",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient_id: discordUserId,
    }),
  })

  if (!channelRes.ok) {
    const text = await channelRes.text()
    throw new Error(`Discord DM channel error ${channelRes.status}: ${text}`)
  }

  const channel = await channelRes.json()

  const msgRes = await fetch(
    `https://discord.com/api/v10/channels/${channel.id}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    }
  )

  if (!msgRes.ok) {
    const text = await msgRes.text()
    throw new Error(`Discord DM send error ${msgRes.status}: ${text}`)
  }
}

async function removeRole(discordUserId, roleId) {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )

  if (!res.ok && res.status !== 404) {
    const text = await res.text()
    throw new Error(`Discord remove role error ${res.status}: ${text}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const accessToken = (req.headers.authorization || "")
      .replace("Bearer ", "")
      .trim()

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
      .upsert(
        {
          discord_id: application.discord_id,
          wl_status: action,
        },
        { onConflict: "discord_id" }
      )

    if (updateUserError) {
      return res.status(500).json({ error: updateUserError.message })
    }

    if (action === "approved") {
      if (process.env.DISCORD_AWAITING_ROLE_ID) {
        await removeRole(application.discord_id, process.env.DISCORD_AWAITING_ROLE_ID)
      }

      if (process.env.DISCORD_ALLOWLIST_ROLE_ID) {
        await addRole(application.discord_id, process.env.DISCORD_ALLOWLIST_ROLE_ID)
      }
    }

    const mention = `<@${application.discord_id}>`

if (action === "approved") {
  await sendDiscordDM(
    application.discord_id,
    `✅ **Gratulujeme k úspěšnému whitelistu!**

Zdravíme, ${mention},

tvůj WL formulář byl **schválen**. Vítej na ElevateRP!

Můžeš se připojit na server a začít hrát.

**Pravidla serveru**
https://elevate-rp-webbbb-sigma.vercel.app/#`
  )
}

if (action === "denied") {
  await sendDiscordDM(
    application.discord_id,
    `❌ **Tvůj formulář byl zamítnut**

Zdravíme, ${mention},

sice to tentokrát nevyšlo, ale určitě jsi do toho dal maximum. Prosím přečti si znovu pravidla a zkus to zítra přibližně v tento čas.

**Důvod zamítnutí**
${reviewNote || "Důvod nebyl uveden."}

**Pravidla serveru**
https://elevate-rp-webbbb-sigma.vercel.app/#`
  )
}

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error." })
  }
}