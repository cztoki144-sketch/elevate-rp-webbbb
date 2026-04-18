import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function Login() {
const loginWithDiscord = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Přihlášení přes Discord</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-white/80">
          <p>
            Přihlas se přes Discord, aby sis mohl podat whitelist žádost,
            sledovat její stav a po schválení se ti správně propsal Allowlist.
          </p>
          <Button className="rounded-2xl w-full" onClick={loginWithDiscord}>
            Přihlásit přes Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
