import { supabase } from "./supabase"
import { getDiscordIdentity } from "./auth"

export async function syncCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return { user: null, profile: null }

  const { discordUserId, username, avatarUrl } = getDiscordIdentity(user)

  const payload = {
    auth_user_id: user.id,
    discord_user_id: discordUserId,
    discord_username: username,
    discord_avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  }

  const { data: profile, error: upsertError } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "auth_user_id" })
    .select()
    .single()

  if (upsertError) {
    console.error("Nepodařilo se synchronizovat uživatele", upsertError)
    return { user, profile: null }
  }

  return { user, profile }
}
