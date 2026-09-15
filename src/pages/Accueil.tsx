import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";

/* Accueil « neige » — fond #FFFAFA, encre #0F0F0F.

   Intro : « way » se pose lettre par lettre, chacune fondant à l'écran au
   ralenti (très flou → net). Le mot reste optiquement CENTRÉ pendant qu'il se
   construit : on mesure la largeur réelle de chaque lettre une fois la police
   chargée, puis on décale la rangée de (largeur totale − largeur visible) / 2.
   Résultat : le « w » seul est au centre exact de l'écran, et le mot glisse
   doucement à mesure qu'il s'allonge.

   Les rayons bleus sont une seule instance, en dehors de l'intro comme de
   l'accueil : le fond ne bouge pas d'un pixel au moment du fondu. */

const LETTERS = ["w", "a", "y"] as const;

/* rythme de l'intro (ms) — lent, comme demandé.
   LETTER_MS doit rester égal à la transition de .snow-letter : le mot ne part
   en fondu qu'une fois la dernière lettre complètement posée. */
const FIRST_MS = 350;   // avant la première lettre
const STEP_MS = 1300;   // écart entre deux lettres
const LETTER_MS = 2000; // durée du fondu d'une lettre
const HOLD_MS = 1100;   // le mot complet respire
const LEAVE_MS = 1300;  // fondu de sortie

const NAV = [
  { label: "Accueil", href: "#top", current: true },
  { label: "Réalisations", href: "#realisations" },
  { label: "Services", href: "#services" },
  { label: "Kairos", href: "#kairos" },
];

export default function Accueil() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [step, setStep] = useState(reduced ? LETTERS.length : 0);
  const [phase, setPhase] = useState<"intro" | "leaving" | "home">(reduced ? "home" : "intro");
  const [widths, setWidths] = useState<number[] | null>(null);

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* largeur réelle de chaque lettre, une fois la police chargée */
  useLayoutEffect(() => {
    if (reduced) return;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const w = letterRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0);
      if (w.every((n) => n > 0)) setWidths(w);
    };
    document.fonts?.ready.then(measure).catch(measure);
    measure();
    window.addEventListener("resize", measure);
    return () => { alive = false; window.removeEventListener("resize", measure); };
  }, [reduced]);

  useEffect(() => {
    document.documentElement.style.background = "#FFFAFA";
    return () => { document.documentElement.style.background = ""; };
  }, []);

  /* déroulé de l'intro */
  useEffect(() => {
    const reveal = () => {
      (window as unknown as { __wayRevealed?: boolean }).__wayRevealed = true;
      window.dispatchEvent(new Event("way:revealed"));
    };
    if (reduced) { reveal(); return; }

    const timers: number[] = [];
    LETTERS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), FIRST_MS + i * STEP_MS));
    });
    const doneAt = FIRST_MS + (LETTERS.length - 1) * STEP_MS + LETTER_MS + HOLD_MS;
    timers.push(window.setTimeout(() => setPhase("leaving"), doneAt));
    timers.push(window.setTimeout(() => { setPhase("home"); reveal(); }, doneAt + LEAVE_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  /* décalage qui garde le mot centré pendant qu'il se construit */
  const shift = (() => {
    if (!widths) return 0;
    const total = widths.reduce((a, b) => a + b, 0);
    const shown = widths.slice(0, Math.max(step, 1)).reduce((a, b) => a + b, 0);
    return (total - shown) / 2;
  })();

  return (
    <div className="snow relative min-h-screen overflow-hidden">
      <ContactModal />

      {/* fond vivant — une seule instance, partagée par l'intro et l'accueil */}
      <div className="snow-rays" aria-hidden />

      {/* ── intro « way » ── */}
      {phase !== "home" && (
        <div className={`snow-intro${phase === "leaving" ? " snow-intro--leave" : ""}`} aria-hidden>
          <div
            className="snow-intro-word snow-serif-i"
            style={{ transform: `translateX(${shift}px)` }}
          >
            {LETTERS.map((ch, i) => (
              <span
                key={ch}
                ref={(el) => { letterRefs.current[i] = el; }}
                className={`snow-letter${i < step ? " snow-letter--in" : ""}`}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── accueil ── */}
      <div className={`snow-home${phase !== "intro" ? " snow-home--in" : ""}`}>
        {/* nav : grille 1fr / auto / 1fr et padding symétrique → les liens
            tombent au centre exact, quelle que soit la largeur du logo */}
        <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-4">
          <nav
            className="grid w-full max-w-[860px] items-center rounded-full p-1.5"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              background: "#FFFFFF",
              boxShadow: "inset 0 0 0 1px rgba(15,15,15,0.07), 0 10px 30px -18px rgba(15,15,15,0.25)",
            }}
          >
            <a href="#top" className="flex items-center gap-2 justify-self-start pl-2.5" aria-label="Way agency, accueil">
              <svg viewBox="0 0 48 48" className="h-[21px] w-[21px]" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="21" stroke="#0F0F0F" strokeWidth="3" />
                <path d="M13 18 L18.75 31 L24 21 L29.25 31 L35 18" stroke="#0F0F0F" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[15px] leading-none tracking-[-0.01em]">
                <span className="font-semibold">Way</span>
                {/* « agency » et le libellé long du bouton disparaissent à
                    l'étroit : sinon les deux se chevauchent sur mobile */}
                <span className="ml-1 hidden font-normal sm:inline" style={{ color: "rgba(15,15,15,0.5)" }}>agency</span>
              </span>
            </a>

            {/* colonnes fixées explicitement : masqués, les liens ne sont plus
                un élément de grille et le bouton remonterait à leur place */}
            <div className="hidden items-center justify-self-center md:flex" style={{ gridColumn: 2 }}>
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  aria-current={n.current ? "page" : undefined}
                  className="snow-tab rounded-full px-3.5 py-2 text-[14px] transition-colors"
                  style={{ color: n.current ? "#0F0F0F" : "rgba(15,15,15,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0F0F0F")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = n.current ? "#0F0F0F" : "rgba(15,15,15,0.55)")}
                >
                  {n.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => openContact()}
              className="justify-self-end whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-px sm:px-4"
              style={{ background: "#0F0F0F", color: "#FFFAFA", gridColumn: 3 }}
            >
              <span className="sm:hidden">Rendez-vous</span>
              <span className="hidden sm:inline">Prendre rendez-vous</span>
            </button>
          </nav>
        </header>

        <main id="top" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="text-[clamp(2.4rem,7vw,5.4rem)] font-bold leading-[1.04] tracking-[-0.04em]">
            Créer. Échouer. <span className="snow-serif-i font-medium">Évoluer.</span>
          </h1>

          <p className="mt-7 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: "rgba(15,15,15,0.55)" }}>
            Studio créatif à Strasbourg. Des sites qu'on refait jusqu'à ce qu'ils soient justes.
          </p>
        </main>
      </div>
    </div>
  );
}
