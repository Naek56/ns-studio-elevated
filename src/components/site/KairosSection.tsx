import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section Kairos — « Et après la livraison ? ». Design : un motif d'IA
   (réseau neuronal) animé. Trois piliers : observe / comprend / analyse. */
const PILLARS = [
  { n: "01", t: "Il observe", d: "Kairos s'intègre invisiblement à votre site. Vos visiteurs ne savent pas qu'il est là. Lui voit tout — chaque clic, chaque hésitation, chaque abandon." },
  { n: "02", t: "Il comprend", d: "Il ne compte pas des clics. Il comprend des comportements. Pourquoi un visiteur est parti. Ce qu'il cherchait sans le trouver. Le moment exact où il a perdu confiance." },
  { n: "03", t: "Il analyse", d: "Chaque semaine Kairos croise toutes ces données. Il identifie les frictions invisibles, les opportunités manquées, ce qui vous fait perdre des clients sans que vous le sachiez." },
];

// réseau neuronal : 3 couches de nœuds + connexions
const LAYERS = [
  [{ x: 20, y: 30 }, { x: 20, y: 60 }, { x: 20, y: 90 }],
  [{ x: 90, y: 20 }, { x: 90, y: 47 }, { x: 90, y: 73 }, { x: 90, y: 100 }],
  [{ x: 160, y: 45 }, { x: 160, y: 75 }],
];
const NODES = LAYERS.flat();
const EDGES: { a: { x: number; y: number }; b: { x: number; y: number } }[] = [];
for (let l = 0; l < LAYERS.length - 1; l++)
  LAYERS[l].forEach((a) => LAYERS[l + 1].forEach((b) => EDGES.push({ a, b })));

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
        {/* design : motif d'IA (réseau neuronal) */}
        <svg aria-hidden viewBox="0 0 180 120" className="ka-motif mx-auto h-24 w-auto text-white opacity-0 md:h-28" fill="none">
          {EDGES.map((e, i) => (
            <line key={i} className="ka-edge" x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke="currentColor" strokeWidth="1" opacity="0.2" />
          ))}
          {NODES.map((n, i) => (
            <circle key={i} className="ka-node" cx={n.x} cy={n.y} r="4" fill="currentColor" opacity="0.7" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          ))}
        </svg>

        <p className="ka-in type-body mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">Le cerveau</p>
        <h2 className="ka-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          Et après la livraison ? C'est là que tout commence vraiment.
        </h2>
        <p className="ka-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          La plupart des agences livrent et disparaissent. Nous on reste. Parce qu'on a créé Kairos une intelligence artificielle qui se connecte à votre site et observe ce que vos visiteurs font vraiment.
        </p>

        <div className="ka-grid mt-16 grid grid-cols-1 gap-10 text-left sm:grid-cols-3 md:mt-20 md:gap-8">
          {PILLARS.map((p) => (
            <div key={p.n} className="ka-pillar opacity-0">
              <p className="type-body text-sm font-semibold tabular-nums text-white/50">{p.n}</p>
              <h3 className="type-strong mt-2 text-xl text-white md:text-2xl">{p.t}</h3>
              <span className="mt-3 block h-px w-10 bg-white/30" />
              <p className="type-body mt-4 text-sm leading-relaxed text-white/75">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
