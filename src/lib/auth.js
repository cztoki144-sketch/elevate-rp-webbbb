export function getDiscordIdentity(user) {
  const identity = user?.identities?.find((item) => item.provider === "discord")
  const identityData = identity?.identity_data || {}
  const metadata = user?.user_metadata || {}

  return {
    discordUserId:
      identityData.provider_id ||
      identityData.sub ||
      metadata.provider_id ||
      metadata.sub ||
      metadata.user_name ||
      metadata.preferred_username ||
      null,
    username:
      metadata.full_name ||
      metadata.name ||
      metadata.user_name ||
      metadata.preferred_username ||
      user?.email ||
      "Uživatel",
    avatarUrl:
      metadata.avatar_url ||
      (metadata.avatar && metadata.provider_id
        ? `https://cdn.discordapp.com/avatars/${metadata.provider_id}/${metadata.avatar}.png`
        : null),
  }
}
