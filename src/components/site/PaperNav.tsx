import { openContact } from "./ContactModal";

/* Navbar carton/papier : reprend la texture de la photo de fond, avec un
   grain papier et une ombre douce pour l'effet carton. Logo à gauche,
   bouton contact à droite. */
export default function PaperNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="paper paper-grain relative mx-auto flex max-w-[1500px] items-center justify-between rounded-xl px-5 py-3 sm:px-7 sm:py-3.5">
        <a href="#accueil" className="relative z-10 flex items-center gap-3 text-neutral-900" aria-label="WAY Agency">
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
    </header>
  );
}
