import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ScribbleButton from "./ScribbleButton";
import PixelFill from "./PixelFill";
import { sfxPop, sfxTap, sfxSuccess, sfxHmm, sfxWhoosh, sfxFinale, sfxPixels } from "@/lib/sfx";

/* L'expérience — un film interactif sur la mémoire.
   Chaque « beat » s'enchaîne automatiquement (un clic pendant un texte
   passe au suivant). Les silences sont de vrais écrans vides. */

type Beat =
  | { kind: "button" }                    // bouton + « Ne l'oublie pas »
  | { kind: "pop" }                       // le bouton explose (cartoon)
  | { kind: "text"; lines: string[]; hold?: number }
  | { kind: "quiz" }
  | { kind: "silence"; hold: number }
  | { kind: "stack"; lines: string[]; hold?: number } // lignes qui s'accumulent
  | { kind: "button2"; hold: number }     // le bouton, légèrement différent
  | { kind: "finale" };

const SCRIPT: Beat[] = [
  { kind: "button" },
  { kind: "pop" },
  { kind: "text", lines: ["Parfait"], hold: 1500 },
  { kind: "text", lines: ["Maintenant, essayons quelque chose."], hold: 2100 },
  { kind: "quiz" },
  // (la réponse insère son propre feedback)
  { kind: "text", lines: ["Mais ce n'était pas le test."], hold: 2300 },
  { kind: "silence", hold: 3000 },
  { kind: "stack", lines: ["Depuis le début, ton cerveau essayait de retenir une seule chose.", "Un bouton.", "Une couleur.", "Une action."], hold: 2600 },
  { kind: "text", lines: ["Mais demande-toi quelque chose..."], hold: 2200 },
  { kind: "text", lines: ["Est-ce que tu te souviens réellement du bouton ?"], hold: 2400 },
  { kind: "button2", hold: 5000 },
  { kind: "silence", hold: 3000 },
  { kind: "text", lines: ["Chaque souvenir que tu possèdes est une reconstruction."], hold: 2600 },
  { kind: "text", lines: ["Ton cerveau ne conserve pas le monde."], hold: 2300 },
  { kind: "text", lines: ["Il crée une version du monde."], hold: 2400 },
  { kind: "text", lines: ["C'est aussi ce qui rend chaque personne unique."], hold: 2500 },
  { kind: "text", lines: ["Deux personnes peuvent voir la même chose..."], hold: 2300 },
  { kind: "text", lines: ["et repartir avec deux expériences complètement différentes."], hold: 2700 },
  { kind: "text", lines: ["Un site fonctionne exactement comme un souvenir."], hold: 2600 },
  { kind: "text", lines: ["Ce n'est pas seulement ce que les visiteurs voient qui compte."], hold: 2500 },
  { kind: "text", lines: ["C'est ce qu'ils comprennent."], hold: 2100 },
  { kind: "text", lines: ["Ce qu'ils retiennent."], hold: 2400 },
  { kind: "finale" },
];

const CHOICES = ["Bleu", "Blanc", "Rouge", "Noir"];

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function MemoryExperience() {
  const [step, setStep] = useState(0);
  const [popping, setPopping] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null); // « Bonne réponse » / rappel
  const [leaving, setLeaving] = useState(false); // transition pixels vers /agence
  const navigate = useNavigate();
  const timer = useRef<number | undefined>(undefined);
  const beat = SCRIPT[step];

  const next = useCallback(() => setStep((s) => Math.min(s + 1, SCRIPT.length - 1)), []);

  // sons liés aux beats passifs
  useEffect(() => {
    if (!beat) return;
    if (beat.kind === "button2") sfxWhoosh();
    if (beat.kind === "finale") sfxFinale();
  }, [beat]);

  // enchaînement automatique des beats passifs
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!beat) return;
    if (beat.kind === "text" || beat.kind === "stack" || beat.kind === "silence" || beat.kind === "button2") {
      const hold =
        beat.kind === "stack"
          ? (beat.lines.length - 1) * 1000 + (beat.hold ?? 2400)
          : beat.kind === "text"
            ? (beat.hold ?? 2200)
            : beat.hold;
      timer.current = window.setTimeout(next, hold);
    }
    return () => window.clearTimeout(timer.current);
  }, [step, beat, next]);

  // pendant le feedback du quiz, avancer après une pause
  useEffect(() => {
    if (feedback === null) return;
    const t = window.setTimeout(() => { setFeedback(null); next(); }, 1700);
    return () => window.clearTimeout(t);
  }, [feedback, next]);

  const popButton = () => {
    if (popping) return;
    sfxPop();
    setPopping(true);
    window.setTimeout(() => { setPopping(false); setStep(2); }, 620);
  };

  const answer = (c: string) => {
    sfxTap();
    if (c === "Rouge") { sfxSuccess(); setFeedback("Bonne réponse"); }
    else { sfxHmm(); setFeedback("Il était rouge."); }
  };

  // un clic pendant un texte / silence fait avancer (jamais pendant une interaction)
  const clickThrough = () => {
    if (!beat) return;
    if (beat.kind === "text" || beat.kind === "stack" || beat.kind === "silence" || beat.kind === "button2") next();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background: [
          "radial-gradient(65% 55% at 33% 20%, rgba(214,242,255,0.92) 0%, rgba(150,222,252,0.5) 38%, rgba(70,180,240,0) 72%)",
          "radial-gradient(42% 78% at 80% 62%, rgba(72,196,255,0.85) 0%, rgba(40,150,225,0.35) 40%, rgba(20,90,170,0) 70%)",
          "radial-gradient(90% 85% at 48% 42%, rgba(24,96,168,0.55) 0%, rgba(12,44,92,0.3) 45%, rgba(4,12,30,0) 75%)",
          "linear-gradient(140deg, #060b17 0%, #081a33 38%, #061426 66%, #04070f 100%)",
        ].join(", "),
      }}
      onClick={clickThrough}
    >
      {/* grain photographique (film) par-dessus le dégradé */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0" style={{ opacity: 0.22, mixBlendMode: "overlay" }} />

      <AnimatePresence mode="wait">

        {/* ── 0. le bouton + « Ne l'oublie pas » ── */}
        {beat.kind === "button" && !popping && (
          <motion.div key="btn" {...fade} className="flex flex-col items-center">
            <ScribbleButton onClick={(e?: unknown) => { (e as Event | undefined)?.stopPropagation?.(); popButton(); }} />
            <p className="type-body mt-16 text-sm tracking-[0.22em] text-white/60 sm:text-base">Ne l'oublie pas</p>
          </motion.div>
        )}

        {/* ── 1. pop cartoon ── */}
        {(beat.kind === "button" || beat.kind === "pop") && popping && (
          <motion.div key="pop" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex flex-col items-center">
            <div className="sb-pop"><ScribbleButton /></div>
            {/* éclats */}
            <svg viewBox="0 0 200 120" className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-auto -translate-x-1/2 -translate-y-1/2">
              <g className="sb-burst" stroke="#ff6a4d" strokeWidth="5" strokeLinecap="round">
                <path d="M100 10 v-14 M160 30 l12 -12 M186 66 h14 M160 96 l12 12 M100 112 v14 M40 96 l-12 12 M14 66 h-14 M40 30 l-12 -12" />
              </g>
            </svg>
            <p className="type-body mt-16 text-sm tracking-[0.22em] text-white/60 opacity-0 sm:text-base">Ne l'oublie pas</p>
          </motion.div>
        )}

        {/* ── textes simples ── */}
        {beat.kind === "text" && (
          <motion.p key={`t${step}`} {...fade} className="type-strong max-w-3xl" style={{ fontSize: "clamp(1.5rem, 4.2vw, 2.9rem)" }}>
            {beat.lines[0]}
          </motion.p>
        )}

        {/* ── quiz ── */}
        {beat.kind === "quiz" && (
          <motion.div key="quiz" {...fade} className="flex flex-col items-center">
            {feedback === null ? (
              <>
                <p className="type-strong max-w-2xl" style={{ fontSize: "clamp(1.5rem, 4.2vw, 2.7rem)" }}>
                  De quelle couleur était le bouton ?
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {CHOICES.map((c) => (
                    <button
                      key={c}
                      onClick={(e) => { e.stopPropagation(); answer(c); }}
                      className="type-body rounded-full border border-white/30 px-7 py-3 text-base text-white/85 transition-all duration-300 hover:scale-[1.05] hover:border-white hover:bg-white/10 active:scale-95 sm:px-8"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <motion.p key="fb" {...fade} className="type-strong" style={{ fontSize: "clamp(1.5rem, 4.2vw, 2.9rem)" }}>
                {feedback}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── silence : rien ── */}
        {beat.kind === "silence" && <motion.div key={`s${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}

        {/* ── lignes qui s'accumulent ── */}
        {beat.kind === "stack" && (
          <motion.div key={`st${step}`} {...fade} className="max-w-3xl space-y-5">
            {beat.lines.map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={i === 0 ? "type-strong" : "type-strong text-white/90"}
                style={{ fontSize: i === 0 ? "clamp(1.4rem, 3.6vw, 2.4rem)" : "clamp(1.6rem, 4.4vw, 3rem)" }}
              >
                {l}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* ── le bouton, légèrement différent ── */}
        {beat.kind === "button2" && (
          <motion.div key="btn2" {...fade} className="flex flex-col items-center">
            <ScribbleButton variant="alt" />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="type-strong mt-12 max-w-2xl text-white/90"
              style={{ fontSize: "clamp(1.2rem, 3vw, 1.9rem)" }}
            >
              Ou est-ce que ton cerveau vient simplement de reconstruire ce souvenir ?
            </motion.p>
          </motion.div>
        )}

        {/* ── finale : logo en haut, texte au MILIEU, CTA sobre en dessous ── */}
        {beat.kind === "finale" && (
          <motion.div key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex h-full w-full flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-12 flex flex-col items-center gap-3 text-white sm:top-14"
            >
              <svg viewBox="0 0 48 48" className="h-14 w-14 sm:h-16 sm:w-16" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.2" />
                <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="type-body text-sm font-semibold tracking-[0.3em]">WAY</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="type-strong max-w-2xl"
              style={{ fontSize: "clamp(1.4rem, 3.6vw, 2.4rem)" }}
            >
              Nous ne créons pas seulement des sites.
              <span className="mt-2 block">Nous créons des expériences qui restent.</span>
            </motion.p>

            {/* bouton sobre (sans cartoon) vers le site de l'agence */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.7 }}
              onClick={(e) => { e.stopPropagation(); if (!leaving) { sfxPixels(); setLeaving(true); } }}
              className="type-body mt-12 rounded-full border border-white/45 px-8 py-3.5 text-base font-medium text-white transition-colors duration-300 hover:bg-white hover:text-neutral-900"
            >
              Découvrir l'agence
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* transition : écran noir → pixels bleus qui envahissent → site agence */}
      {leaving && <PixelFill onDone={() => navigate("/agence")} />}
    </div>
  );
}
