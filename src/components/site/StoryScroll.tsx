import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "'Poppins', system-ui, sans-serif";

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

function WLogo({ size = 56, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" />
      <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------------------- cloudy sky --------------------------------- */
/* grey & overcast at the start, clears up (brighter, monochrome) by the end */
const clouds = [
  { l: "6%", t: "16%", w: "42vh", h: "30vh", a: "animate-drift" },
  { l: "58%", t: "10%", w: "48vh", h: "32vh", a: "animate-drift-slow" },
  { l: "28%", t: "54%", w: "52vh", h: "34vh", a: "animate-float" },
  { l: "74%", t: "58%", w: "40vh", h: "28vh", a: "animate-drift" },
];

function Sky({ step }: { step: number }) {
  const t = [0, 0.14, 0.78, 1][step]; // brighten more on discovery (step 2)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0A0A0A", zIndex: 0 }}>
      {clouds.map((c, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${c.a}`}
          style={{
            left: c.l,
            top: c.t,
            width: c.w,
            height: c.h,
            background: `radial-gradient(closest-side, rgba(255,255,255,${0.05 + t * 0.18}), transparent 72%)`,
            filter: "blur(44px)",
            opacity: 0.5 + t * 0.5,
            transition: "background 0.8s ease, opacity 0.8s ease",
          }}
        />
      ))}
      {/* the clearing light, breaking through behind the visual */}
      <div
        className="absolute rounded-full"
        style={{
          left: "70%",
          top: "42%",
          width: "80vh",
          height: "80vh",
          transform: `translate(-50%,-50%) scale(${0.6 + t * 0.8})`,
          background: "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0.22) 42%, transparent 72%)",
          opacity: t * 0.6,
          filter: "blur(22px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      />
      <div className="absolute inset-0" style={{ background: `rgba(255,255,255,${t * 0.07})`, transition: "background 0.8s ease" }} />
    </div>
  );
}

/* ---------------------------------- visuals --------------------------------- */

function Screen({ children, bg, dead }: { children: ReactNode; bg: string; dead?: boolean }) {
  return (
    <div className="absolute inset-0 p-5" style={{ background: bg, filter: dead ? "saturate(0) blur(1px)" : "none" }}>
      {children}
    </div>
  );
}

const flatPts = "0,80 40,78 80,82 120,79 160,81 200,80 240,82 280,79 320,81 360,80";
const risePts = "0,92 45,86 90,84 135,72 180,66 225,52 270,40 315,26 360,12";

function VisualBefore() {
  return (
    <Screen bg="#141414" dead>
      <p style={{ fontFamily: FONT, fontSize: 11 }} className="text-white/45">3 visiteurs aujourd'hui</p>
      <p style={{ fontFamily: FONT, fontSize: 11 }} className="mt-1 text-white/30">0 contact ce mois-ci</p>
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-1/2 w-[calc(100%-40px)]">
        <polyline points={flatPts} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      </svg>
    </Screen>
  );
}

function VisualProblem({ active }: { active: boolean }) {
  return (
    <Screen bg="#141414">
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-1/2 w-[calc(100%-40px)]">
        <polyline points={flatPts} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </svg>
      {[12, 30, 52, 74].map((left, i) => (
        <motion.span
          key={left}
          className="absolute top-6 h-1.5 w-1.5 rounded-full bg-white/70"
          style={{ left: `${left}%` }}
          animate={{ x: [0, 26], y: [0, -16], opacity: [0.8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
        />
      ))}
      {[20, 60].map((top, i) => (
        <motion.span
          key={top}
          className="absolute right-4 text-lg font-bold text-white/55"
          style={{ top: `${top}%` }}
          animate={{ x: [0, 14], opacity: [0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
        >
          ↗
        </motion.span>
      ))}
      <div className="absolute inset-x-0 bottom-1/2 flex translate-y-1/2 flex-col items-center text-center">
        <span style={{ fontFamily: FONT, fontWeight: 600 }} className="text-5xl text-white">
          <CountUp to={97} active={active} />%
        </span>
        <span style={{ fontFamily: FONT, fontSize: 11 }} className="mt-1 text-white/50">ne reviennent jamais</span>
      </div>
    </Screen>
  );
}

function VisualDiscovery() {
  return (
    <Screen bg="#16161a">
      <motion.div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.4), transparent 70%)" }}
        animate={{ scale: [0.6, 1.2, 0.9], opacity: [0.4, 0.85, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <WLogo size={56} color="#fff" />
      </div>
      <div className="absolute inset-x-5 bottom-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        <span style={{ fontFamily: FONT, fontSize: 11 }} className="text-white/80">Kairos connecté. Analyse en cours</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full bg-white"
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
    <Screen bg="#f5f5f5">
      <svg viewBox="0 0 360 100" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-3/5 w-[calc(100%-40px)]">
        <polyline points={risePts} fill="none" stroke="#111" strokeWidth="2.5" />
      </svg>
      <div className="absolute left-4 right-4 top-4 flex flex-col gap-2">
        {notes.map((n, i) => (
          <motion.div
            key={n}
            initial={{ x: 60, opacity: 0 }}
            animate={active ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
            transition={{ duration: 0.45, delay: active ? 0.2 + i * 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 shadow-sm"
            style={{ fontFamily: FONT, fontSize: 10 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="text-black/75">{n}</span>
          </motion.div>
        ))}
      </div>
    </Screen>
  );
}

/* ---------------------------------- steps ----------------------------------- */

const STEPS: { kicker: string; title: ReactNode }[] = [
  { kicker: "AVANT", title: <>Vous avez un site.<br /><em className="italic font-medium">Personne</em> ne vient.</> },
  { kicker: "LE PROBLÈME", title: <>Vos visiteurs partent.<br />En <em className="italic font-medium">silence</em>.</> },
  { kicker: "LA DÉCOUVERTE", title: <>Vous découvrez WAY.<br />Et <em className="italic font-medium">Kairos</em>.</> },
  { kicker: "APRÈS", title: <>Votre site travaille.<br />Même la nuit.</> },
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
    <section ref={wrapRef} id="story" className="relative h-[400vh] md:h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Sky step={step} />

        <div className="relative z-10 flex h-full flex-col">
          {/* step counter */}
          <div className="absolute right-6 top-24 md:right-12 md:top-28" style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            <AnimatePresence mode="wait">
              <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                0{step + 1} / 04
              </motion.span>
            </AnimatePresence>
          </div>

          {/* main content */}
          <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-16 md:px-12">
            <div className="relative flex min-h-[200px] w-full items-center md:min-h-[280px] md:w-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)" }} className="uppercase">
                    {STEPS[step].kicker}
                  </p>
                  <h2 className="mt-5 text-white" style={{ fontFamily: FONT, fontWeight: 600, fontSize: "clamp(32px, 5.5vw, 58px)", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                    {STEPS[step].title}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex w-full justify-center md:w-1/2">
              <div className="relative aspect-[4/3] w-full max-w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0e0e0e] shadow-2xl md:max-w-[520px]">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <div className="ml-3 h-3.5 flex-1 rounded bg-white/5" />
                </div>
                <div className="relative h-[calc(100%-43px)]">
                  <AnimatePresence>
                    <motion.div key={step} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                      {visuals[step]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* progress indicator */}
          <div className="absolute inset-x-0 bottom-8 px-6 md:bottom-10 md:px-12">
            <div className="mx-auto flex max-w-[1300px] items-center justify-between" style={{ fontFamily: FONT, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
              <span>Avant</span>
              <span>Après</span>
            </div>
            <div className="relative mx-auto mt-2 h-[2px] max-w-[1300px] bg-white/15">
              <div ref={barRef} className="absolute left-0 top-0 h-full bg-white" style={{ width: "0%" }} />
              {[0, 1, 2, 3].map((i) => {
                const filled = i <= step;
                const current = i === step;
                return (
                  <span
                    key={i}
                    className="absolute top-1/2 h-2.5 w-2.5 rounded-full transition-all duration-500"
                    style={{
                      left: `${((i + 0.5) / 4) * 100}%`,
                      background: filled ? "#fff" : "transparent",
                      border: `1px solid ${filled ? "#fff" : "rgba(255,255,255,0.35)"}`,
                      transform: `translate(-50%,-50%) scale(${current ? 1.5 : 1})`,
                      boxShadow: current ? "0 0 12px rgba(255,255,255,0.85)" : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
