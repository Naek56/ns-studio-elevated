import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";
import CloudDecor, { type CloudDeco } from "./CloudDecor";

const DECO: CloudDeco[] = [
  { top: "9%", left: "5%", size: 120, seed: 7, opacity: 0.44, flip: true },
  { bottom: "12%", right: "7%", size: 126, seed: 25, opacity: 0.42, flip: false },
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
      <CloudDecor items={DECO} />
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
