import React from "react"
import { Routes, Route } from "react-router-dom"
import { motion } from "framer-motion"
import AuthCallback from "@/pages/AuthCallback"
import Navbar from "@/components/Navbar"
import Rules from "@/pages/Rules"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import Whitelist from "@/pages/Whitelist"
import AdminWhitelist from "@/pages/AdminWhitelist"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Gamepad2, Shield, Users, MessageSquare, Crown, Server, MessageCircleMore, Play } from "lucide-react"

const LINKS = {
  DISCORD: "https://discord.gg/bBEP7vxHQ7",
  CONNECT: "fivem://connect/146.59.73.118:30036",
  STATUS_ENDPOINT: "/api/status.json",
}

function Home() {
  const [status, setStatus] = React.useState({ playersOnline: 0, slots: 128, whitelistedCount: 60 })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(LINKS.STATUS_ENDPOINT)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const faqs = [
    { q: "Jak se připojit?", a: "Otevři FiveM a do F8 napiš IP nebo použij tlačítko Připojit." },
    { q: "Jak získám WL?", a: "Přihlas se přes Discord, otevři Žádost o WL a sleduj stav v profilu." },
    { q: "Máte VIP?", a: "Ano. VIP je dobrovolná podpora serveru s kosmetickými výhodami. Nic pay-to-win." },
    { q: "Minimální věk?", a: "Doporučujeme 15+, hlavní je však slušné chování a znalost pravidel RP." },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <Navbar />

      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(239,68,68,0.25),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4">CZ/SK FiveM Roleplay</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Vstup do města, kde <span className="text-red-400">tvoje rozhodnutí</span> mění příběh
            </h1>
            <p className="mt-4 text-white/80 max-w-prose">
              Vybuduj si kariéru, frakci nebo byznys. Hraj čestně, respektuj pravidla a užij si kvalitní RP s aktivní komunitou.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={LINKS.CONNECT}><Button size="lg" className="rounded-2xl"><Play className="w-4 h-4 mr-2" />Připojit přes FiveM</Button></a>
              <a href={LINKS.DISCORD} target="_blank" rel="noreferrer"><Button size="lg" variant="secondary" className="rounded-2xl"><MessageCircleMore className="w-4 h-4 mr-2" />Vstoupit na Discord</Button></a>
            </div>
            <div className="mt-6 text-sm text-white/60">
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4" /> WL-ON</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Card className="backdrop-blur">
              <CardHeader><CardTitle className="flex items-center gap-2"><Server className="w-5 h-5" /> Stav serveru</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-xs text-white/60">Hráči online</p><p className="text-2xl font-bold">{loading ? "…" : status.playersOnline}</p></div>
                  <div><p className="text-xs text-white/60">Sloty</p><p className="text-2xl font-bold">{loading ? "…" : status.slots}</p></div>
                  <div><p className="text-xs text-white/60">WL schválených</p><p className="text-2xl font-bold">{loading ? "…" : status.whitelistedCount}</p></div>
                </div>
                <div className="text-sm text-white/70"><p>IP:</p><code className="text-white">146.59.73.118:30036</code></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Funkce a gameplay</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Shield className="w-6 h-6 text-red-400" />, title: "Whitelist / Pravidla", desc: "Vyvážený RP zážitek, jasná pravidla a férový staff tým." },
            { icon: <Users className="w-6 h-6 text-red-400" />, title: "Komunita", desc: "Aktivní CZ/SK hráči, eventy, frakce i legální/ilegální práce." },
            { icon: <Gamepad2 className="w-6 h-6 text-red-400" />, title: "Ekonomika & Joby", desc: "Vyvážená ekonomika, brigády, podnikání a custom systémy." },
            { icon: <MessageSquare className="w-6 h-6 text-red-400" />, title: "Discord Support", desc: "Ticket systém, WL pohovory a oznámení jen pár kliků." },
          ].map((f) => (
            <Card key={f.title}><CardHeader><CardTitle className="flex items-center gap-2">{f.icon}{f.title}</CardTitle></CardHeader><CardContent className="text-white/80">{f.desc}</CardContent></Card>
          ))}
        </div>
      </section>

      <section id="vip" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { tier: "VIP Bronze", desc: "Ideální na podporu serveru a drobné bonusy.", list: ["Základní kosmetické výhody", "VIP role na Discordu", "Žádné P2W prvky"] },
            { tier: "VIP Silver", desc: "Vyvážený balíček pro aktivní hráče.", list: ["Vše z Bronze", "Extra kosmetika / animace", "Přednostní WL termíny"] },
            { tier: "VIP Gold", desc: "Pro největší srdcaře komunity.", list: ["Vše ze Silver", "Exkluzivní badge ve hře", "Speciální Discord kanál"] },
          ].map((v) => (
            <Card key={v.tier} className={v.tier.includes("Silver") ? "ring-1 ring-red-500/30" : ""}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-red-400" />{v.tier}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-white/80">
                <p>{v.desc}</p>
                <ul className="list-disc ml-5 space-y-1">{v.list.map((li) => <li key={li}>{li}</li>)}</ul>
                <Button className="mt-2 rounded-2xl w-full">Podpořit</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">FAQ</h2>
        <Accordion className="p-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div><div className="font-semibold">ElevateRP</div><p className="mt-2 text-white/70">Černo‑červený Elevate styl. Stačí doplnit tokeny do .env a SQL do Supabase.</p></div>
          <div><div className="font-semibold mb-2">Odkazy</div><ul className="space-y-1"><li><a className="hover:underline" href="/pravidla">Pravidla</a></li><li><a className="hover:underline" href="/whitelist">Žádost o WL</a></li><li><a className="hover:underline" href="/profile">Profil</a></li></ul></div>
          <div><div className="font-semibold mb-2">Zůstaň v kontaktu</div><div className="flex gap-2"><a href={LINKS.DISCORD} target="_blank" rel="noreferrer"><Button variant="secondary" className="rounded-2xl">Discord</Button></a></div></div>
        </div>
        <div className="text-center text-xs text-white/50 pb-8">© {new Date().getFullYear()} ElevateRP — Všechna práva vyhrazena.</div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/pravidla" element={<><Navbar /><Rules /></>} />
      <Route path="/whitelist" element={<Whitelist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin/wl" element={<AdminWhitelist />} />
    </Routes>
  )
}
