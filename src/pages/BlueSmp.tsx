import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Check,
  Swords,
  Coins,
  Users,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   BLUE SMP — page unique du serveur Minecraft.
   ⚠️  À PERSONNALISER : remplace l'IP, le lien Discord et les stats
   ci-dessous par les vraies infos de ton serveur.
   ──────────────────────────────────────────────────────────────── */
const SERVER_IP = "play.bluesmp.net";
const BEDROCK_PORT = "19132";
const DISCORD_URL = "https://discord.gg/bluesmp";
const MC_VERSION = "1.21+";

/* ---------- petit bandeau de flocons/particules bleues ---------- */
function Particles() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const N = 26;
    for (let i = 0; i < N; i++) {
      const p = document.createElement("span");
      const size = 3 + Math.random() * 6;
      p.style.cssText = `
        position:absolute;top:-20px;left:${Math.random() * 100}%;
        width:${size}px;height:${size}px;background:#7ec8ff;
        box-shadow:0 0 8px rgba(126,200,255,.8);opacity:${0.3 + Math.random() * 0.5};
        animation:mcfall ${8 + Math.random() * 12}s linear ${Math.random() * 10}s infinite;
      `;
      el.appendChild(p);
    }
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}

/* ---------- barre de copie d'IP ---------- */
function IpCopy({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <button
      onClick={copy}
      className="mc-panel group flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:brightness-110"
    >
      <span className="flex flex-col">
        <span className="font-pixel text-[0.55rem] uppercase tracking-widest text-accent">
          {label}
        </span>
        <span className="font-round text-lg font-semibold text-white sm:text-xl">
          {value}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 font-pixel text-[0.55rem] uppercase text-white/80">
        {copied ? (
          <>
            <Check className="h-4 w-4 text-accent" /> Copié
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copier
          </>
        )}
      </span>
    </button>
  );
}

/* ---------- carte feature ---------- */
function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Swords;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mc-panel p-6 transition duration-300 hover:-translate-y-1">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/15 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-pixel mb-2 text-sm text-white">{title}</h3>
      <p className="font-round text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

/* ---------- item FAQ ---------- */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mc-panel">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-round text-base font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-accent transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="font-round border-t-2 border-border px-5 py-4 text-[0.95rem] leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}

const NAV = [
  { href: "#accueil", label: "Accueil" },
  { href: "#features", label: "Le serveur" },
  { href: "#rejoindre", label: "Rejoindre" },
  { href: "#faq", label: "FAQ" },
];

export default function BlueSmp() {
  const [menu, setMenu] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* keyframes locales */}
      <style>{`
        @keyframes mcfall { to { transform: translateY(110vh) rotate(180deg); } }
        @keyframes floaty { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-14px) } }
      `}</style>

      {/* ───────── NAVBAR ───────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-border/70 bg-[#071331]/85 backdrop-blur-md">
        <nav className="container-tight flex h-16 items-center justify-between">
          <a href="#accueil" className="flex items-center gap-3">
            <span className="grid h-9 w-9 grid-cols-3 grid-rows-3 gap-[2px]">
              {[0,1,0,1,2,1,0,1,0].map((v, i) => (
                <span
                  key={i}
                  className={
                    v === 2 ? "bg-[#1e6fd6]" : v === 1 ? "bg-[#3fa9ff]" : "bg-[#7ec8ff]"
                  }
                />
              ))}
            </span>
            <span className="font-pixel text-sm text-white">BLUE SMP</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-round text-sm font-medium text-white/80 transition hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="mc-btn mc-btn--ghost !py-3 !px-4">
              <MessageCircle className="h-4 w-4" /> Discord
            </a>
          </div>

          <button
            className="text-white md:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
          >
            {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {menu && (
          <div className="border-t-2 border-border bg-[#071331] px-6 py-4 md:hidden">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="font-round block py-2 text-white/85"
              >
                {n.label}
              </a>
            ))}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="font-round mt-2 block py-2 font-semibold text-accent"
            >
              Rejoindre le Discord →
            </a>
          </div>
        )}
      </header>

      {/* ───────── HERO ───────── */}
      <section
        id="accueil"
        className="relative flex min-h-screen items-center overflow-hidden bg-grid pt-16"
      >
        <Particles />
        <div className="container-tight relative z-10 grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="mc-panel font-pixel mb-6 inline-flex items-center gap-2 px-3 py-2 text-[0.55rem] uppercase text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Serveur Survie · Java & Bedrock
            </span>

            <h1 className="wordmark mb-4 text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              BLUE
              <br />
              SMP
            </h1>

            <p className="font-round mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Plonge dans une aventure Minecraft glacée. Survie, économie,
              events communautaires et une communauté soudée qui n'attend que
              toi. Construis, explore, domine.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#rejoindre" className="mc-btn">
                <Swords className="h-4 w-4" /> Jouer maintenant
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="mc-btn mc-btn--ghost"
              >
                <MessageCircle className="h-4 w-4" /> Discord
              </a>
            </div>
          </div>

          {/* bloc IP + stats */}
          <div className="flex flex-col gap-4" style={{ animation: "floaty 6s ease-in-out infinite" }}>
            <IpCopy label="IP Java" value={SERVER_IP} />
            <IpCopy label="IP Bedrock (port)" value={`${SERVER_IP} : ${BEDROCK_PORT}`} />
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "Version", v: MC_VERSION },
                { k: "En ligne", v: "24/7" },
                { k: "Mode", v: "SMP" },
              ].map((s) => (
                <div key={s.k} className="mc-panel px-3 py-4 text-center">
                  <div className="font-pixel text-sm text-accent">{s.v}</div>
                  <div className="font-round mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section id="features" className="relative py-24">
        <div className="container-tight">
          <div className="mb-14 text-center">
            <h2 className="font-pixel mb-4 text-2xl text-white sm:text-3xl">
              Pourquoi <span className="text-accent">BLUE SMP</span> ?
            </h2>
            <p className="font-round mx-auto max-w-xl text-muted-foreground">
              Un serveur pensé pour durer, avec tout ce qu'il faut pour vivre
              la meilleure expérience Minecraft entre amis.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={Swords} title="Survie pure">
              Un vrai SMP sans pay-to-win. Farm, PvP consenti, donjons et boss.
              Ton skill fait la différence.
            </Feature>
            <Feature icon={Coins} title="Économie vivante">
              Boutiques joueurs, marché, métiers et monnaie. Deviens le plus
              riche du serveur à la sueur de ton pioche.
            </Feature>
            <Feature icon={Users} title="Communauté active">
              Des centaines de joueurs, un staff présent et un Discord animé.
              Trouve ta team en quelques minutes.
            </Feature>
            <Feature icon={CalendarDays} title="Events réguliers">
              Chasses au trésor, tournois PvP, constructions à thème et
              récompenses exclusives chaque semaine.
            </Feature>
            <Feature icon={ShieldCheck} title="Anti-grief & stable">
              Protections de zone, rollback et hébergement performant. Tes
              constructions sont en sécurité, 24h/24.
            </Feature>
            <Feature icon={Sparkles} title="Java + Bedrock">
              Rejoins depuis PC, console ou mobile. Tout le monde joue ensemble
              sur le même monde.
            </Feature>
          </div>
        </div>
      </section>

      {/* ───────── REJOINDRE ───────── */}
      <section id="rejoindre" className="relative py-24">
        <div className="container-tight">
          <div className="mb-14 text-center">
            <h2 className="font-pixel mb-4 text-2xl text-white sm:text-3xl">
              Comment nous <span className="text-accent">rejoindre</span>
            </h2>
            <p className="font-round mx-auto max-w-xl text-muted-foreground">
              Trois étapes, deux minutes chrono, et tu es dans le monde.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Lance Minecraft",
                d: `Ouvre Minecraft en version ${MC_VERSION} (Java ou Bedrock) et va dans « Multijoueur ».`,
              },
              {
                n: "2",
                t: "Ajoute le serveur",
                d: `Colle l'IP ${SERVER_IP}. En Bedrock, ajoute le port ${BEDROCK_PORT}.`,
              },
              {
                n: "3",
                t: "Rejoins & joue",
                d: "Connecte-toi, lis les règles au spawn et commence ton aventure BLUE SMP !",
              },
            ].map((s) => (
              <div key={s.n} className="mc-panel p-7 text-center">
                <div className="font-pixel mx-auto mb-4 grid h-14 w-14 place-items-center border-2 border-primary bg-primary/15 text-xl text-accent">
                  {s.n}
                </div>
                <h3 className="font-pixel mb-2 text-sm text-white">{s.t}</h3>
                <p className="font-round text-[0.95rem] leading-relaxed text-muted-foreground">
                  {s.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <IpCopy label="IP du serveur — clique pour copier" value={SERVER_IP} />
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="relative py-24">
        <div className="container-tight max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="font-pixel mb-4 text-2xl text-white sm:text-3xl">
              Questions <span className="text-accent">fréquentes</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <Faq
              q="Le serveur est-il gratuit ?"
              a="Oui, totalement gratuit. Aucun paiement n'est requis pour jouer. Des cosmétiques optionnels peuvent exister mais rien qui donne un avantage en jeu (no pay-to-win)."
            />
            <Faq
              q="Puis-je jouer sur Bedrock (console / mobile) ?"
              a={`Oui ! BLUE SMP est cross-play. Ajoute l'IP ${SERVER_IP} avec le port ${BEDROCK_PORT} sur Bedrock et joue avec les joueurs Java.`}
            />
            <Faq
              q="Quelle version de Minecraft utiliser ?"
              a={`Le serveur tourne sur la version ${MC_VERSION}. Il est recommandé d'être à jour pour éviter les problèmes de connexion.`}
            />
            <Faq
              q="Comment signaler un problème ou un joueur ?"
              a="Rejoins notre Discord et ouvre un ticket auprès du staff. Nous répondons rapidement, 7j/7."
            />
          </div>

          <div className="mt-12 text-center">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="mc-btn">
              <MessageCircle className="h-4 w-4" /> Rejoindre le Discord
            </a>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t-2 border-border/70 bg-[#050d24] py-10">
        <div className="container-tight flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 grid-cols-3 grid-rows-3 gap-[2px]">
              {[0,1,0,1,2,1,0,1,0].map((v, i) => (
                <span
                  key={i}
                  className={
                    v === 2 ? "bg-[#1e6fd6]" : v === 1 ? "bg-[#3fa9ff]" : "bg-[#7ec8ff]"
                  }
                />
              ))}
            </span>
            <span className="font-pixel text-sm text-white">BLUE SMP</span>
          </div>
          <p className="font-round text-sm text-muted-foreground">
            IP : <span className="text-accent">{SERVER_IP}</span> · Version {MC_VERSION}
          </p>
          <p className="font-round text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} BLUE SMP · Non affilié à Mojang / Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
}
