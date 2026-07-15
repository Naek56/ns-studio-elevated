import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";
import PixelIcon, { type PixelIconName } from "./PixelIcon";

/* Section Kairos — « Et après la livraison ? ». Trois piliers numérotés. */
const PILLARS: { n: string; t: string; icon: PixelIconName }[] = [
  { n: "01", t: "Il observe", icon: "globe" },
  { n: "02", t: "Il comprend", icon: "bulb" },
  { n: "03", t: "Il analyse", icon: "diamond" },
];

export default function KairosSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set([".ka-in", ".ka-pillar"], { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".ka-in", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 66%", once: true },
      });
      gsap.fromTo(".ka-pillar", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ".ka-grid", start: "top 82%", once: true },
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el || (s.trigger as Element)?.classList?.contains?.("ka-grid")) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="kairos" className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32">
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <p className="ka-in type-body flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">
          <PixelIcon name="globe" size={16} />Le cerveau<PixelIcon name="diamond" size={16} />
        </p>
        <h2 className="ka-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          Et après la livraison ? C'est là que tout <span className="mark-select">commence</span> vraiment.
        </h2>
        <p className="ka-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          La plupart des agences livrent et disparaissent. Nous on reste. Parce qu'on a créé Kairos une intelligence artificielle qui se connecte à votre site et observe ce que vos visiteurs font vraiment.
        </p>

        <div className="ka-grid mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mt-20">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className="ka-pillar flex flex-col items-center gap-3 rounded-2xl border border-white/20 p-10 opacity-0 md:p-12"
              style={{ background: "linear-gradient(165deg, rgba(34,62,110,0.32) 0%, rgba(16,32,62,0.38) 60%, rgba(10,22,44,0.42) 100%)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 40px -18px rgba(0,0,0,0.4)" }}
            >
              <PixelIcon name={p.icon} size={30} />
              <p className="type-body text-sm font-semibold tabular-nums text-white/45">{p.n}</p>
              <h3 className="type-strong text-2xl text-white md:text-3xl">{p.t}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
