import { useEffect, useRef } from "react";
import { openContact } from "./ContactModal";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

type Lenis = { scrollTo: (t: Element | number, o?: Record<string, unknown>) => void };

const LINKS = [
  { id: "#accueil", label: "Accueil" },
  { id: "#reveil", label: "Le réveil" },
  { id: "#question", label: "Le constat" },
  { id: "#kairos", label: "Kairos" },
  { id: "#story", label: "Histoire" },
];

/* Navbar minimaliste (transparente, texte blanc) : logo, quelques liens,
   Contact. Visible sur les sections 1 et 2 ; disparaît vers le haut (fondu
   + léger flou) dès qu'on entre dans la section Kairos, revient au retour. */
export default function PaperNav() {
  const ref = useRef<HTMLElement>(null);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (!el) return;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -10 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const st = ScrollTrigger.create({
      trigger: "#kairos",
      start: "top 78%",
      onEnter: () => gsap.to(el, { yPercent: -140, opacity: 0, filter: "blur(6px)", duration: 0.55, ease: "power3.in", pointerEvents: "none" }),
      onLeaveBack: () => gsap.to(el, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out", pointerEvents: "auto" }),
    });
    return () => st.kill();
  }, []);

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8 sm:pt-6" style={{ willChange: "transform, opacity" }}>
      <div className="mx-auto flex max-w-[1500px] items-center justify-between text-white">
        <a href="#accueil" onClick={goTo("#accueil")} className="flex items-center gap-2.5" aria-label="WAY Agency">
          <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden>
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
            <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="type-body text-sm font-semibold tracking-[0.22em]">WAY</span>
        </a>

        <nav className="type-body hidden items-center gap-8 text-sm text-white/80 sm:flex">
          {LINKS.map((l) => (
            <a key={l.id} href={l.id} onClick={goTo(l.id)} className="nav-underline transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <button
          onClick={openContact}
          className="type-body rounded-full border border-white/45 px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-neutral-900"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
