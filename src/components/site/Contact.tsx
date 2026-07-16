import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";
import { openContact } from "./ContactModal";
import { sfxTap } from "@/lib/sfx";
import { gsap, REDUCED } from "@/lib/gsapSetup";
import CloudDecor, { type CloudDeco } from "./CloudDecor";

const CONTACT_DECO: CloudDeco[] = [
  { top: "12%", left: "7%", size: 146, seed: 8, opacity: 0.5, delay: 0.4, travel: 54, pivot: 5, dur: 16, flip: false },
  { top: "20%", right: "8%", size: 112, seed: 15, opacity: 0.44, delay: 2.2, travel: -46, pivot: 6, dur: 19, flip: true },
  { bottom: "22%", left: "11%", size: 124, seed: 2, opacity: 0.46, delay: 1.4, travel: 48, pivot: 4, dur: 21, flip: false },
];

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
    <section ref={root} id="contact" className="relative flex min-h-[85svh] flex-col justify-between overflow-hidden px-6 pt-28 pb-12 text-center">
      <CloudDecor items={CONTACT_DECO} />
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <p className="c-in type-body text-xs font-semibold uppercase tracking-[0.34em] text-white/70 opacity-0">
          Parlons de votre projet
        </p>
        <h2 className="c-in type-strong mt-6 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}>
          Vous ne le <span className="mark-select">regretterez</span> pas.
        </h2>
        <button
          onClick={() => { sfxTap(); openContact(); }}
          className="c-in type-body group mt-9 inline-flex items-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-base font-medium text-white opacity-0 transition-colors duration-300 hover:bg-white hover:text-neutral-900"
        >
          Démarrer un projet
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <Footer />
    </section>
  );
}
