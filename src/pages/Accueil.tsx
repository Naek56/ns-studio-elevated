import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";

/* Accueil « neige » — fond #FFFAFA, encre #0F0F0F.

   Intro : « way » se pose lettre par lettre. Chaque lettre se matérialise
   (flou, échelle et opacité ensemble) et le mot reste optiquement centré
   pendant qu'il s'allonge : on mesure la largeur réelle de chaque lettre une
   fois la police chargée, puis on décale la rangée de
   (largeur totale − largeur visible) / 2.

   Passation : le mot se dématérialise PENDANT que l'accueil se matérialise,
   sur la même courbe inversée et au même instant. Il n'y a jamais d'image
   morte entre les deux, et le fond ne bouge pas puisqu'il est commun. */

const LETTERS = ["w", "a", "y"] as const;

/* rythme de l'intro (ms) */
const FIRST_MS = 350;    // avant la première lettre
const STEP_MS = 1250;    // écart entre deux lettres
const LETTER_MS = 1900;  // = transition de .snow-letter
const HOLD_MS = 900;     // le mot complet respire
const HANDOFF_MS = 1250; // = transition de .snow-home

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
  /* "intro" → "handoff" (les deux se croisent) → "home" (l'intro sort du DOM) */
  const [phase, setPhase] = useState<"intro" | "handoff" | "home">(reduced ? "home" : "intro");
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
    // la passation démarre une fois la dernière lettre complètement posée
    const handoffAt = FIRST_MS + (LETTERS.length - 1) * STEP_MS + LETTER_MS + HOLD_MS;
    timers.push(window.setTimeout(() => { setPhase("handoff"); reveal(); }, handoffAt));
    timers.push(window.setTimeout(() => setPhase("home"), handoffAt + HANDOFF_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  /* décalage qui garde le mot centré pendant qu'il se construit */
  const shift = (() => {
    if (!widths) return 0;
    const total = widths.reduce((a, b) => a + b, 0);
    const shown = widths.slice(0, Math.max(step, 1)).reduce((a, b) => a + b, 0);
    return (total - shown) / 2;
  })();

  const homeIn = phase !== "intro";

  return (
    <div className="snow relative min-h-screen overflow-hidden">
      <ContactModal />

      {/* fond vivant — une seule instance, partagée par l'intro et l'accueil,
          donc rien ne saute au moment de la passation */}
      <div className="snow-bloom" aria-hidden />
      <div className="snow-rays" aria-hidden />

      {/* ── intro « way » ── */}
      {phase !== "home" && (
        <div className="snow-intro" aria-hidden>
          <div
            className={`snow-intro-word snow-serif-i${phase === "handoff" ? " snow-intro--out" : ""}`}
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
      <div className={`snow-home${homeIn ? " snow-home--in" : ""}`}>
        {/* nav sans fond : le verre est réservé au bouton, là où il attire
            l'œil — deux surfaces translucides superposées tueraient la
            lisibilité. Grille 1fr/auto/1fr, colonnes fixées explicitement. */}
        <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-5">
          <nav className="grid w-full max-w-[880px] items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            <a
              href="#top"
              className="lg-press justify-self-start rounded-full"
              aria-label="Way, accueil"
              style={{ gridColumn: 1 }}
            >
              <svg viewBox="0 0 48 48" className="h-[26px] w-[26px]" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="21" stroke="#0F0F0F" strokeWidth="3" />
                <path d="M13 18 L18.75 31 L24 21 L29.25 31 L35 18" stroke="#0F0F0F" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <div className="hidden items-center justify-self-center md:flex" style={{ gridColumn: 2 }}>
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  aria-current={n.current ? "page" : undefined}
                  className="snow-tab rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors"
                  style={{ color: n.current ? "#0F0F0F" : "rgba(15,15,15,0.68)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0F0F0F")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = n.current ? "#0F0F0F" : "rgba(15,15,15,0.68)")}
                >
                  {n.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => openContact()}
              className="lg-dark lg-press justify-self-end whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium sm:px-5"
              style={{ gridColumn: 3 }}
            >
              <span className="relative z-10 sm:hidden">Rendez-vous</span>
              <span className="relative z-10 hidden sm:inline">Prendre rendez-vous</span>
            </button>
          </nav>
        </header>

        <main id="top" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="snow-display text-[clamp(2.6rem,7.4vw,5.8rem)]">
            Créer. Échouer. <i>Évoluer.</i>
          </h1>

          <p
            className="mt-8 max-w-[40ch] text-[16px] font-medium leading-relaxed"
            style={{ color: "rgba(15,15,15,0.74)" }}
          >
            Studio créatif à Strasbourg. Des sites qu'on refait jusqu'à ce qu'ils soient justes.
          </p>

          <button
            onClick={() => openContact()}
            className="lg lg-press mt-10 rounded-full px-6 py-3 text-[15px] font-semibold"
            style={{ color: "#0F0F0F" }}
          >
            Parler du projet
          </button>
        </main>
      </div>
    </div>
  );
}
