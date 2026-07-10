import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section 2 — deux yeux « doodle » (contour amande + cils tout autour +
   iris + pupille) qui clignent, errent dans une zone définie et dont l'iris
   balaie de droite à gauche (et suit le curseur sur desktop). */

// cils répartis tout autour de l'œil (points sur une ellipse, vers l'extérieur)
const CX = 120, CY = 85, RX = 95, RY = 46;
const LASHES = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const sx = CX + Math.cos(a) * RX, sy = CY + Math.sin(a) * RY;
  const dx = Math.cos(a), dy = Math.sin(a);
  const len = 22 + (i % 2) * 4;
  return { x1: sx, y1: sy, x2: sx + dx * len, y2: sy + dy * len };
});

export default function EyesSection() {
  const root = useRef<HTMLElement>(null);
  const irises = useRef<HTMLElement[]>([]);
  const eyes = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    irises.current = gsap.utils.toArray<HTMLElement>(".eye-iris");
    eyes.current = gsap.utils.toArray<HTMLElement>(".eye");

    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".eye", ".q-big", ".q-small"], { opacity: 1, scale: 1, y: 0 });
        return;
      }
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 64%", once: true }, defaults: { ease: "power3.out" } })
        .fromTo(".eye", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12 })
        .fromTo(".q-big", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.5")
        .fromTo(".q-small", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");

      const coarse = window.matchMedia("(pointer: coarse)").matches;

      eyes.current.forEach((eye, i) => {
        // errance dans une zone bornée (± quelques px)
        gsap.to(eye, { x: () => gsap.utils.random(-26, 26), y: () => gsap.utils.random(-20, 20),
          duration: 3 + i, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true, delay: i * 0.5 });
        // clignement périodique (squash vertical rapide)
        const blink = () => {
          gsap.timeline({ onComplete: () => gsap.delayedCall(gsap.utils.random(2.4, 5), blink) })
            .to(eye, { scaleY: 0.08, duration: 0.09, ease: "power2.in", transformOrigin: "center" })
            .to(eye, { scaleY: 1, duration: 0.14, ease: "power2.out" });
        };
        gsap.delayedCall(1.5 + i * 0.7, blink);
      });

      // iris : balayage droite → gauche en continu (+ un peu de vertical)
      if (coarse) {
        irises.current.forEach((ir, i) => {
          gsap.to(ir, { x: 13, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.25 });
          gsap.to(ir, { y: () => gsap.utils.random(-6, 6), duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true });
        });
      } else {
        irises.current.forEach((ir) => gsap.to(ir, { x: 12, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true }));
      }
    }, root);

    // suivi du curseur (desktop) : prend le dessus sur le balayage
    const move = (e: PointerEvent) => {
      eyes.current.forEach((eye, i) => {
        const r = eye.getBoundingClientRect();
        const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
        const ir = irises.current[i];
        if (ir) gsap.to(ir, { x: Math.cos(a) * 14, y: Math.sin(a) * 9, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      });
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine && !REDUCED) window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("pointermove", move);
      ctx.revert();
      ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); });
    };
  }, []);

  const Eye = () => (
    <div className="eye relative will-change-transform" style={{ width: "clamp(96px, 15vw, 180px)" }}>
      <svg viewBox="0 0 240 170" className="w-full overflow-visible" aria-hidden>
        {LASHES.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
        ))}
        <path d="M18 85 Q120 22 222 85 Q120 148 18 85 Z" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
        <g className="eye-iris" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="120" cy="85" r="34" fill="none" stroke="#ffffff" strokeWidth="6" />
          <circle cx="120" cy="85" r="15" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );

  return (
    <section ref={root} id="question" className="relative flex min-h-[86svh] items-center justify-center overflow-hidden px-6 py-20">
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[62vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      {/* desktop : yeux de part et d'autre ; mobile : au-dessus */}
      <div className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center gap-14 md:inset-0 md:top-0 md:items-center md:justify-between md:gap-0 md:px-[6vw]">
        <Eye />
        <Eye />
      </div>

      <div className="relative mx-auto mt-28 max-w-3xl text-center md:mt-0">
        <h2 className="q-big type-strong opacity-0" style={{ fontSize: "clamp(2.1rem, 5.8vw, 4.2rem)" }}>
          Tes futurs clients te cherchent déjà
        </h2>
        <p className="q-small type-strong mt-5 text-white/90 opacity-0" style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.9rem)" }}>
          Mais vont-ils te trouver ?
        </p>
      </div>
    </section>
  );
}
