import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section 2 — le constat. Message central fort (le plus visible), entouré de
   faux avis Google « Je ne vous trouve pas en ligne ? », 2 de chaque côté,
   à des hauteurs différentes et dans l'ombre (secondaires). */

type Review = { name: string; initial: string; color: string; stars: number; text: string; cls: string };

const REVIEWS: Review[] = [
  // visible aussi sur mobile (petit, en haut à gauche)
  { name: "Julien M.", initial: "J", color: "#c0392b", stars: 1, text: "Je ne vous trouve pas en ligne ?", cls: "left-[3%] top-[4%] scale-[0.6] md:left-[3%] md:top-[18%] md:scale-100 -rotate-3" },
  { name: "Sarah L.",  initial: "S", color: "#2e86c1", stars: 2, text: "Vous avez un site au moins ?", cls: "hidden md:block md:left-[8%] md:top-[57%] rotate-2" },
  { name: "Marc D.",   initial: "M", color: "#8e44ad", stars: 1, text: "Impossible de vous trouver sur Google…", cls: "hidden md:block md:right-[4%] md:top-[26%] rotate-3" },
  // visible aussi sur mobile (petit, en bas à droite)
  { name: "Léa P.",    initial: "L", color: "#e67e22", stars: 3, text: "J'ai fini par appeler un concurrent.", cls: "right-[3%] bottom-[4%] scale-[0.6] md:right-[9%] md:bottom-auto md:top-[62%] md:scale-100 -rotate-2" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i < n ? "#fbbc04" : "#dadce0"} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45 24c0-1.4-.1-2.7-.4-4H24v8h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7C42.5 36.6 45 30.8 45 24z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.8-2 14.4-5.3l-7-5.5c-2 1.3-4.5 2-7.4 2-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9z" />
      <path fill="#EA4335" d="M24 11.4c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.8 4.9 29.9 3 24 3 15.4 3 8.1 7.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
    </svg>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className={`review-card pointer-events-none absolute w-[228px] rounded-xl bg-white/95 p-4 text-left shadow-2xl ${r.cls}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: r.color }}>
          {r.initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-neutral-800">{r.name}</p>
          <p className="text-[10px] text-neutral-500">il y a 2 jours</p>
        </div>
        <GoogleG />
      </div>
      <div className="mt-2">
        <Stars n={r.stars} />
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-neutral-700">« {r.text} »</p>
    </div>
  );
}

export default function ReviewsSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".rv-l1", ".rv-l2"], { opacity: 1, y: 0 });
        gsap.set(".review-card", { opacity: 0.68 });
        return;
      }
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 64%", once: true }, defaults: { ease: "power3.out" } })
        // les avis (secondaires, dans l'ombre) arrivent d'abord, discrètement
        .fromTo(".review-card", { opacity: 0, y: 24 }, { opacity: 0.68, y: 0, duration: 0.9, stagger: 0.12 })
        // le message central s'impose ensuite, net et lumineux
        .fromTo(".rv-l1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
        .fromTo(".rv-l2", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.55");
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="question" className="relative flex min-h-[92svh] items-center justify-center overflow-hidden px-6 py-20">
      {/* avis Google, en retrait / dans l'ombre */}
      {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}

      {/* nappe pour détacher le message central des avis */}
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[52vh] w-[92vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="rv-l1 type-strong opacity-0" style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}>
          Maintenant imagine que tes clients fassent pareil.
        </h2>
        <h2 className="rv-l2 type-strong mt-4 opacity-0" style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}>
          Et ne trouvent pas ton nom.
        </h2>
      </div>
    </section>
  );
}
