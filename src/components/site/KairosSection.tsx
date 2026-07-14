import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";
import { IconObserve, IconUnderstand, IconAnalyze } from "./AnimatedIcons";

/* Section Kairos — « Et après la livraison ? ». Design : un motif d'IA
   (réseau neuronal) animé. Trois piliers illustrés (animés). */
const PILLARS = [
  { n: "01", t: "Il observe", icon: <IconObserve /> },
  { n: "02", t: "Il comprend", icon: <IconUnderstand /> },
  { n: "03", t: "Il analyse", icon: <IconAnalyze /> },
];

// réseau neuronal : 3 couches de nœuds + connexions COURBES
const LAYERS = [
  [{ x: 24, y: 28 }, { x: 24, y: 62 }, { x: 24, y: 96 }],
  [{ x: 110, y: 16 }, { x: 110, y: 46 }, { x: 110, y: 76 }, { x: 110, y: 106 }],
  [{ x: 196, y: 42 }, { x: 196, y: 80 }],
];
const NODES = LAYERS.flat();
// arêtes courbées (quadratique, léger bombé) — plus organiques que des droites
const EDGES: { d: string }[] = [];
for (let l = 0; l < LAYERS.length - 1; l++)
  LAYERS[l].forEach((a) => LAYERS[l + 1].forEach((b) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 + (b.y - a.y) * 0.12;
    EDGES.push({ d: `M${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}` });
  }));
// trajets des « impulsions » qui voyagent dans le réseau
const PULSES = [
  `M24 28 Q 67 24 110 16 Q 153 30 196 42`,
  `M24 62 Q 67 70 110 76 Q 153 79 196 80`,
  `M24 96 Q 67 102 110 106 Q 153 75 196 42`,
];

export default function KairosSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set([".ka-in", ".ka-pillar", ".ka-motif"], { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".ka-motif", { opacity: 0, scale: 0.85 }, {
        opacity: 1, scale: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
      gsap.fromTo(".ka-in", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 66%", once: true },
      });
      gsap.fromTo(".ka-pillar", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ".ka-grid", start: "top 82%", once: true },
      });
      // pulsations du réseau
      gsap.to(".ka-node", { scale: 1.5, opacity: 1, transformOrigin: "center", duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: { each: 0.12, from: "random" } });
      gsap.to(".ka-edge", { opacity: 0.5, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: { each: 0.08, from: "random" } });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el || (s.trigger as Element)?.classList?.contains?.("ka-grid")) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="kairos" className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32">
      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* design : motif d'IA — réseau neuronal courbe, nœuds lumineux,
            impulsions qui voyagent le long des connexions */}
        <svg aria-hidden viewBox="0 0 220 122" className="ka-motif mx-auto h-28 w-auto opacity-0 md:h-36" fill="none">
          <defs>
            <radialGradient id="kan-node" cx="0.35" cy="0.35">
              <stop offset="0" stopColor="#cdeaf7" />
              <stop offset="0.6" stopColor="#63b3dd" />
              <stop offset="1" stopColor="#2c5a96" />
            </radialGradient>
            <filter id="kan-glow"><feGaussianBlur stdDeviation="1.6" /></filter>
          </defs>
          {EDGES.map((e, i) => (
            <path key={i} className="ka-edge" d={e.d} stroke="#9fc6e8" strokeWidth="1.1" opacity="0.22" />
          ))}
          {/* impulsions de données */}
          {PULSES.map((d, i) => (
            <circle key={`p${i}`} r="2.6" fill="#eaf6ff" filter="url(#kan-glow)">
              <animateMotion dur={`${3.2 + i * 0.9}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" begin={`${i * 0.8}s`} />
            </circle>
          ))}
          {NODES.map((n, i) => (
            <g key={i}>
              <circle className="ka-node" cx={n.x} cy={n.y} r="7" fill="#63b3dd" opacity="0.25" filter="url(#kan-glow)" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle className="ka-node" cx={n.x} cy={n.y} r="4.4" fill="url(#kan-node)" opacity="0.95" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle cx={n.x - 1.3} cy={n.y - 1.3} r="1.2" fill="#fff" opacity="0.9" />
            </g>
          ))}
        </svg>

        <p className="ka-in type-body mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">Le cerveau</p>
        <h2 className="ka-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          Et après la livraison ? C'est là que tout commence vraiment.
        </h2>
        <p className="ka-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          La plupart des agences livrent et disparaissent. Nous on reste. Parce qu'on a créé Kairos une intelligence artificielle qui se connecte à votre site et observe ce que vos visiteurs font vraiment.
        </p>

        <div className="ka-grid mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mt-20">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className="ka-pillar flex flex-col items-center gap-4 rounded-2xl border border-white/20 p-8 opacity-0 md:p-10"
              style={{ background: "linear-gradient(165deg, rgba(34,62,110,0.32) 0%, rgba(16,32,62,0.38) 60%, rgba(10,22,44,0.42) 100%)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 40px -18px rgba(0,0,0,0.4)" }}
            >
              {p.icon}
              <p className="type-body text-sm font-semibold tabular-nums text-white/50">{p.n}</p>
              <h3 className="type-strong text-xl text-white md:text-2xl">{p.t}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
