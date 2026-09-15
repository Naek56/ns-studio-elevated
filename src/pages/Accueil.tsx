import { useEffect, useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";

/* Accueil « neige » — fond #FFFAFA, encre #0F0F0F.
   1. Intro : « way » apparaît lettre par lettre, chacune fondant à l'écran
      au ralenti (w, puis a, puis y).
   2. L'intro fond à son tour et laisse place à l'accueil, qui se révèle
      dans le mouvement inverse. Les rayons bleus sont identiques des deux
      côtés, donc la transition est continue : seul le mot fond. */

const LETTERS: { ch: string; delay: number }[] = [
  { ch: "w", delay: 0.15 },
  { ch: "a", delay: 1.05 },
  { ch: "y", delay: 1.95 },
];
const HOLD_UNTIL_MS = 4100;   // toutes les lettres sont posées, on laisse respirer
const LEAVE_MS = 1100;        // durée du fondu de sortie de l'intro

const NAV = [
  { label: "Accueil", href: "#top" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Services", href: "#services" },
  { label: "Kairos", href: "#kairos" },
];

function Rays({ opacity, height }: { opacity: number; height: string }) {
  return (
    <div
      aria-hidden
      className="snow-rays"
      style={{ top: "auto", height, opacity }}
    />
  );
}

export default function Accueil() {
  // reduced motion : pas d'intro, on affiche l'accueil directement
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phase, setPhase] = useState<"intro" | "leaving" | "home">(reduced ? "home" : "intro");

  useEffect(() => {
    document.documentElement.style.background = "#FFFAFA";
    return () => { document.documentElement.style.background = ""; };
  }, []);

  useEffect(() => {
    const reveal = () => {
      (window as unknown as { __wayRevealed?: boolean }).__wayRevealed = true;
      window.dispatchEvent(new Event("way:revealed"));
    };
    if (reduced) { reveal(); return; }
    const t1 = window.setTimeout(() => setPhase("leaving"), HOLD_UNTIL_MS);
    const t2 = window.setTimeout(() => { setPhase("home"); reveal(); }, HOLD_UNTIL_MS + LEAVE_MS);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [reduced]);

  const homeIn = phase !== "intro";

  return (
    <div className="snow relative min-h-screen">
      <ContactModal />

      {/* ── intro « way » ── */}
      {phase !== "home" && (
        <div className={`snow-intro${phase === "leaving" ? " snow-intro--leave" : ""}`} aria-hidden>
          <Rays opacity={1} height="62%" />
          <div className="snow-intro-word snow-serif-i">
            {LETTERS.map((l) => (
              <span key={l.ch} className="snow-letter" style={{ animationDelay: `${l.delay}s` }}>
                {l.ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── accueil ── */}
      <div className={`snow-home${homeIn ? " snow-home--in" : ""}`}>
        {/* nav : grille 1fr / auto / 1fr → les liens sont exactement au centre
            de la pilule, quelle que soit la largeur du logo ou du bouton */}
        <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-4">
          <nav
            className="grid w-full max-w-[880px] items-center rounded-full px-1.5 py-1.5"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              background: "#FFFFFF",
              boxShadow: "inset 0 0 0 1px rgba(15,15,15,0.08), 0 10px 30px -18px rgba(15,15,15,0.22)",
            }}
          >
            {/* le retrait du logo vit DANS la 1re colonne : le padding de la
                pilule reste symétrique, donc les liens sont au centre exact */}
            <a href="#top" className="flex items-center gap-2 justify-self-start pl-2.5" aria-label="Way agency, accueil">
              <svg viewBox="0 0 48 48" className="h-[22px] w-[22px]" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="21" stroke="#0F0F0F" strokeWidth="3" />
                <path d="M13 18 L18.75 31 L24 21 L29.25 31 L35 18" stroke="#0F0F0F" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[15px] leading-none tracking-[-0.01em]">
                <span className="font-semibold">Way</span>
                <span className="ml-1 font-normal" style={{ color: "rgba(15,15,15,0.55)" }}>agency</span>
              </span>
            </a>

            <div className="hidden items-center justify-self-center md:flex">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  className="rounded-full px-3.5 py-2 text-[14px] transition-colors"
                  style={{ color: "rgba(15,15,15,0.62)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0F0F0F")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(15,15,15,0.62)")}
                >
                  {n.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => openContact()}
              className="justify-self-end rounded-full px-4 py-2 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-px"
              style={{ background: "#0F0F0F", color: "#FFFAFA" }}
            >
              Prendre rendez-vous
            </button>
          </nav>
        </header>

        {/* hero : tout est centré sur le même axe que la nav */}
        <main id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
          <Rays opacity={0.7} height="52%" />

          <h1 className="relative text-[clamp(2.3rem,6.6vw,5.1rem)] font-bold leading-[1.02] tracking-[-0.04em]">
            <span className="block">Travailler. Essayer.</span>
            <span className="block">
              Échouer. <span className="snow-serif-i font-medium">Réessayer.</span>
            </span>
          </h1>

          <p className="relative mt-7 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: "rgba(15,15,15,0.58)" }}>
            Studio créatif à Strasbourg. Des sites qu'on refait jusqu'à ce qu'ils soient justes.
          </p>
        </main>
      </div>
    </div>
  );
}
