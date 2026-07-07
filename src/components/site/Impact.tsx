import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

/* Le chiffre choc — seul sur l'écran, immense, compté à l'arrivée. */
export default function Impact() {
  const root = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".i-num", ".i-line"], { opacity: 1, y: 0 });
        return;
      }
      // count 0 -> 97 as the number arrives
      const counter = { v: 0 };
      gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 62%", once: true },
        defaults: { ease: "power3.out" },
      })
        .fromTo(".i-num", { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 1.1 })
        .to(counter, {
          v: 97,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => { if (numRef.current) numRef.current.textContent = String(Math.round(counter.v)); },
        }, 0.15)
        .fromTo(".i-line", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7");

      // slow parallax drift while the section crosses the screen
      gsap.to(".i-num", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
      <p className="i-num display-serif leading-none text-white opacity-0 will-change-transform" style={{ fontSize: "clamp(11rem, 36vw, 34rem)" }}>
        <span ref={numRef}>0</span>
        <span className="align-top" style={{ fontSize: "0.36em" }}>%</span>
      </p>
      <p className="i-line mt-4 text-base tracking-[0.12em] text-white/55 opacity-0 sm:text-lg">
        ne reviennent jamais
      </p>
    </section>
  );
}
