import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";
import CloudDecor, { type CloudDeco } from "./CloudDecor";

/* Section « Le cerveau » : décor = 4 cerveaux + 2 nuages, bien éparpillés
   (aucun élément à côté d'un autre). Image cerveau transparente dans /public. */
const BRAINS = [
  { top: "7%", left: "5%", size: 116, opacity: 0.9, flip: false },
  { bottom: "12%", right: "7%", size: 94, opacity: 0.8, flip: true },
];
const CLOUDS: CloudDeco[] = [
  { top: "30%", right: "6%", size: 106, seed: 33, opacity: 0.42, flip: true },
  { bottom: "24%", left: "8%", size: 112, seed: 41, opacity: 0.42, flip: false },
];

/* Section Kairos — « Et après la livraison ? ». (Les colonnes ont été
   retirées — à remplacer par autre chose.) */

export default function KairosSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set(".ka-in", { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".ka-in", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 66%", once: true },
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="kairos" className="relative overflow-hidden px-6 py-28 text-center md:px-10 md:py-36">
      <CloudDecor items={CLOUDS} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {BRAINS.map((b, i) => (
          <img
            key={i}
            src="/brain_rose_pop_trans.png"
            alt=""
            aria-hidden
            className="absolute"
            style={{ top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.size, opacity: b.opacity, transform: b.flip ? "scaleX(-1)" : undefined }}
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <p className="ka-in type-body text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">Le cerveau</p>
        <h2 className="ka-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          Et après la livraison ? C'est là que tout commence vraiment.
        </h2>
        <p className="ka-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          La plupart des agences livrent et disparaissent. Nous on reste. Parce qu'on a créé Kairos une intelligence artificielle qui se connecte à votre site et observe ce que vos visiteurs font vraiment.
        </p>
      </div>
    </section>
  );
}
