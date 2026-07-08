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
      if (REDUCED) { gsap.set(".c-in", { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".c-in", { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 68%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pt-32 pb-12 text-center">
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <p className="c-in type-body text-xs font-semibold uppercase tracking-[0.34em] text-white/70 opacity-0">
          Parlons de votre projet
        </p>
        <h2 className="c-in type-strong mt-8 max-w-4xl opacity-0" style={{ fontSize: "clamp(2.8rem, 8vw, 6.4rem)" }}>
          Vous ne le regretterez pas.
        </h2>
        <button
          onClick={openContact}
          className="c-in type-body group mt-12 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-base font-medium text-neutral-50 opacity-0 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        >
          Démarrer un projet
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <Footer />
    </section>
  );
}
