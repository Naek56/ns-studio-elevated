import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";
import { openContact } from "./ContactModal";
import { gsap, REDUCED } from "@/lib/gsapSetup";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set(".c-in", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(".c-in", { opacity: 0, y: 52 }, {
        opacity: 1, y: 0, duration: 1.05, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 66%", once: true },
      });
      gsap.fromTo(".c-glow", { y: 90 }, {
        y: -90, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black px-6 pt-32 pb-12 text-center">
      <div className="c-glow pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[70vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 will-change-transform">
        <div className="hero-glow h-full w-full" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <p className="c-in text-[11px] font-medium uppercase tracking-[0.34em] text-white/40 opacity-0">
          Parlons de votre projet
        </p>

        <h2 className="c-in display-serif mt-8 max-w-4xl text-white opacity-0" style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}>
          Vous ne le regretterez pas.
        </h2>

        <button onClick={openContact} className="c-in btn-glass group mt-12 px-8 py-3.5 text-base opacity-0">
          Démarrer un projet
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <Footer />
    </section>
  );
}
