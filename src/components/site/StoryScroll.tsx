import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#8C9EFF";
const MONO = "'DM Mono', ui-monospace, monospace";
const SERIF = "'Cormorant Garamond', Georgia, serif";

/* count from 0 to `to` over ~1s whenever it becomes active */
function CountUp({ to, active }: { to: number; active: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) { setV(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (n: number) => {
      const t = Math.min(1, (n - start) / 1000);
      setV(Math.round(t * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);
  return <>{v}</>;
}

function WLogo({ size = 64, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" />
      <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------------------------- visuals --------------------------------- */

function Screen({ children, bg, dead }: { children: ReactNode; bg: string; dead?: boolean }) {
  return (
    <div className="absolute inset-0 p-5" style={{ background: bg, filter: dead ? "saturate(0.35) blur(1px)" : "none" }}>
      {children}
    </div>
  );
}

const flatPts = "0,80 40,78 80,82 120,79 160,81 200,80 240,82 280,79 320,81 360,80";
const risePts = "0,92 45,86 90,84 135,72 180,66 225,52 270,40 315,26 360,12";

function VisualBefore() {
  return (
    <Screen bg="#141418" dead>
      <p style={{ fontFamily: MONO, fontSize: 11 }} className="text-white/45">3 visiteurs aujourd'hui</p>
      <p style={{ fontFamily: MONO, fontSize: 11 }} className="mt-1 text-white/30">0 contact ce mois-ci</p>
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-1/2 w-[calc(100%-40px)]">
        <polyline points={flatPts} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      </svg>
    </Screen>
  );
}

function VisualProblem({ active }: { active: boolean }) {
  return (
    <Screen bg="#141418">
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-1/2 w-[calc(100%-40px)]">
        <polyline points={flatPts} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </svg>
      {/* visitors leaving */}
      {[12, 30, 52, 74].map((left, i) => (
        <motion.span
          key={left}
          className="absolute top-6 h-1.5 w-1.5 rounded-full bg-white/60"
          style={{ left: `${left}%` }}
          animate={{ x: [0, 26], y: [0, -16], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
        />
      ))}
      {/* red arrows out */}
      {[20, 60].map((top, i) => (
        <motion.span
          key={top}
          className="absolute right-4 text-lg font-bold"
          style={{ top: `${top}%`, color: "#ff5a5a" }}
          animate={{ x: [0, 14], opacity: [0.9, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
        >
          ↗
        </motion.span>
      ))}
      <div className="absolute inset-x-0 bottom-1/2 flex translate-y-1/2 flex-col items-center text-center">
        <span style={{ color: "#ff5a5a", fontFamily: SERIF, fontWeight: 300 }} className="text-5xl">
          <CountUp to={97} active={active} />%
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11 }} className="mt-1 text-[#ff8a8a]">ne reviennent jamais</span>
      </div>
    </Screen>
  );
}

function VisualDiscovery() {
  return (
    <Screen bg="linear-gradient(135deg,#15151f,#1d1d2c)">
      <motion.div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${ACCENT}55, transparent 70%)` }}
        animate={{ scale: [0.6, 1.2, 0.9], opacity: [0.4, 0.8, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <WLogo size={56} color="#fff" />
      </div>
      <div className="absolute inset-x-5 bottom-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        <span style={{ fontFamily: MONO, fontSize: 11 }} className="text-white/80">Kairos connecté. Analyse en cours</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full"
              style={{ background: ACCENT }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </span>
      </div>
    </Screen>
  );
}

const notes = ["Nouveau contact reçu", "Rapport Kairos — 3 recommandations", "+47% de visiteurs ce mois"];

function VisualAfter({ active }: { active: boolean }) {
  return (
    <Screen bg="#f4f6ff">
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-3/5 w-[calc(100%-40px)]">
        <polyline points={risePts} fill="none" stroke={ACCENT} strokeWidth="2.5" />
      </svg>
      <div className="absolute left-4 right-4 top-4 flex flex-col gap-2">
        {notes.map((n, i) => (
          <motion.div
            key={n}
            initial={{ x: 60, opacity: 0 }}
            animate={active ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
            transition={{ duration: 0.45, delay: active ? 0.2 + i * 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2 shadow-sm"
            style={{ fontFamily: MONO, fontSize: 10 }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
            <span className="text-black/75">{n}</span>
          </motion.div>
        ))}
      </div>
    </Screen>
  );
}

/* ---------------------------------- steps ----------------------------------- */

const STEPS: { kicker: string; title: ReactNode }[] = [
  {
    kicker: "AVANT",
    title: (
      <>Vous avez un site.<br /><em className="italic">Personne</em> ne vient.</>
    ),
  },
  {
    kicker: "LE PROBLÈME",
    title: (
      <>Vos visiteurs partent.<br />En <em className="italic">silence</em>.</>
    ),
  },
  {
    kicker: "LA DÉCOUVERTE",
    title: (
      <>Vous découvrez WAY.<br />Et <em className="italic" style={{ color: ACCENT }}>Kairos</em>.</>
    ),
  },
  {
    kicker: "APRÈS",
    title: (
      <>Votre site travaille.<br />Même la nuit.</>
    ),
  },
];

export default function StoryScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
      const s = Math.min(3, Math.floor(p * 3.999));
      if (s !== stepRef.current) { stepRef.current = s; setStep(s); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const visuals = [
    <VisualBefore key="0" />,
    <VisualProblem key="1" active={step === 1} />,
    <VisualDiscovery key="2" />,
    <VisualAfter key="3" active={step === 3} />,
  ];

  return (
    <section ref={wrapRef} id="story" className="relative h-[400vh] bg-[#0A0A0A] md:h-[500vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* step counter */}
        <div className="absolute right-6 top-24 z-20 md:right-12 md:top-28" style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          <AnimatePresence mode="wait">
            <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              0{step + 1} / 04
            </motion.span>
          </AnimatePresence>
        </div>

        {/* main content */}
        <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-16 md:px-12">
          {/* left text */}
          <div className="relative flex min-h-[200px] w-full items-center md:min-h-[280px] md:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }} className="uppercase">
                  {STEPS[step].kicker}
                </p>
                <h2 className="mt-5 text-white" style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.1 }}>
                  {STEPS[step].title}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* right visual */}
          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative aspect-[4/3] w-full max-w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0e0e12] shadow-2xl md:max-w-[520px]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <div className="ml-3 h-3.5 flex-1 rounded bg-white/5" />
              </div>
              <div className="relative h-[calc(100%-43px)]">
                <AnimatePresence>
                  <motion.div
                    key={step}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {visuals[step]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* progress indicator */}
        <div className="absolute inset-x-0 bottom-8 px-6 md:bottom-10 md:px-12">
          <div className="mx-auto flex max-w-[1300px] items-center justify-between" style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            <span>Avant</span>
            <span>Après</span>
          </div>
          <div className="relative mx-auto mt-2 h-[2px] max-w-[1300px] bg-white/10">
            <div ref={barRef} className="absolute left-0 top-0 h-full" style={{ background: ACCENT, width: "0%" }} />
            <div className="absolute inset-0 flex items-center justify-between">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full transition-colors duration-300"
                  style={{
                    background: i <= step ? ACCENT : "transparent",
                    border: `1px solid ${i <= step ? ACCENT : "rgba(255,255,255,0.3)"}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
