import { openContact } from "./ContactModal";

type Lenis = { scrollTo: (t: Element | number, o?: Record<string, unknown>) => void };

const LINKS = [
  { id: "#accueil", label: "Accueil" },
  { id: "#question", label: "Le constat" },
  { id: "#kairos", label: "Kairos" },
  { id: "#story", label: "Histoire" },
];

/* Navbar carton/papier : logo à gauche, un bouton par section au centre,
   Contact à droite. Défilement fluide via Lenis. */
export default function PaperNav() {
  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (!el) return;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -24 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="paper paper-grain relative mx-auto flex max-w-[1500px] flex-col gap-2 rounded-xl px-5 py-3 md:block md:py-3.5">
        <div className="flex items-center justify-between">
          <a href="#accueil" onClick={goTo("#accueil")} className="relative z-10 flex items-center gap-3 text-neutral-900" aria-label="WAY Agency">
            <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
              <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="type-body text-base font-semibold leading-none tracking-[0.18em]">
              WAY
              <span className="mt-1 block text-[0.5rem] font-medium tracking-[0.32em] text-neutral-500">CREATIVE AGENCY</span>
            </span>
          </a>

          <button
            onClick={openContact}
            className="type-body relative z-10 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium tracking-wide text-neutral-50 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            Contact
          </button>
        </div>

        {/* un bouton par section — centré (superposé au centre sur desktop) */}
        <nav className="type-body flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm font-medium text-neutral-700 md:pointer-events-none md:absolute md:inset-0 md:mt-0">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.id}
              onClick={goTo(l.id)}
              className="md:pointer-events-auto relative transition-colors hover:text-neutral-900"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
