import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section 2 — la question, encadrée de deux yeux qui apparaissent à l'arrivée
   et suivent le curseur (dartent tout seuls sur mobile / tactile). */
export default function EyesSection() {
  const root = useRef<HTMLElement>(null);
  const pupils = useRef<HTMLElement[]>([]);
  const eyes = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    pupils.current = gsap.utils.toArray<HTMLElement>(".eye-pupil");
    eyes.current = gsap.utils.toArray<HTMLElement>(".eye");

    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".eye", ".q-lead", ".q-punch"], { opacity: 1, scale: 1, y: 0 });
      } else {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 62%", once: true }, defaults: { ease: "power3.out" } })
          .fromTo(".eye", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12 })
          .fromTo(".q-lead", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
          .fromTo(".q-punch", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.5");
      }
    }, root);

    // pupil tracking
    const MAX = 9;
    const move = (cx: number, cy: number) => {
      eyes.current.forEach((eye, i) => {
        const r = eye.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        const a = Math.atan2(cy - ey, cx - ex);
        const d = Math.min(MAX, Math.hypot(cx - ex, cy - ey) / 12);
        const p = pupils.current[i];
        if (p) gsap.to(p, { x: Math.cos(a) * d, y: Math.sin(a) * d, duration: 0.4, ease: "power2.out", overwrite: true });
      });
    };
    const onMove = (e: PointerEvent) => move(e.clientX, e.clientY);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let darter: gsap.core.Tween | null = null;
    if (!coarse && !REDUCED) {
      window.addEventListener("pointermove", onMove);
    } else if (!REDUCED) {
      // touch: eyes glance around on their own
      const dart = () => {
        const a = Math.random() * Math.PI * 2;
        pupils.current.forEach((p) => gsap.to(p, { x: Math.cos(a) * MAX, y: Math.sin(a) * MAX, duration: 0.5, ease: "power2.out" }));
        darter = gsap.delayedCall(1.1 + Math.random(), dart) as unknown as gsap.core.Tween;
      };
      dart();
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      darter?.kill();
      ctx.revert();
      ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); });
    };
  }, []);

  const Eye = () => (
    <div className="eye relative" style={{ width: "clamp(62px, 12vw, 150px)" }}>
      <svg viewBox="0 0 120 80" className="w-full" aria-hidden>
        <path d="M6 40 C 30 8, 90 8, 114 40 C 90 72, 30 72, 6 40 Z" fill="#f6f6f4" stroke="#141414" strokeWidth="3" />
        <g className="eye-pupil" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="60" cy="40" r="19" fill="#1d4ed8" />
          <circle cx="60" cy="40" r="9" fill="#0a0f1f" />
          <circle cx="54" cy="34" r="4" fill="#ffffff" opacity="0.9" />
        </g>
      </svg>
    </div>
  );

  return (
    <section ref={root} id="question" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      {/* desktop : yeux de part et d'autre de la question ; mobile : au-dessus */}
      <div className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center gap-16 md:inset-0 md:top-0 md:items-center md:justify-between md:gap-0 md:px-[8vw]">
        <Eye />
        <Eye />
      </div>

      <div className="relative mx-auto mt-24 max-w-3xl text-center md:mt-0">
        <p className="q-lead type-body text-lg font-medium text-white opacity-0 sm:text-2xl">
          Tes futurs clients te cherchent déjà.
        </p>
        <h2 className="q-punch type-strong mt-6 opacity-0" style={{ fontSize: "clamp(2rem, 6vw, 4.6rem)" }}>
          La vraie question est : vont-ils te trouver ?
        </h2>
      </div>
    </section>
  );
}
