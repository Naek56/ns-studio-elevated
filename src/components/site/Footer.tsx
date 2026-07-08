import { Link } from "react-router-dom";
import { openCookieBanner } from "@/lib/consent";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-[1600px] border-t border-white/15 px-6 pt-8 pb-6">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="#accueil" className="flex items-center gap-3 text-white" aria-label="WAY Agency">
          <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
            <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="type-body text-base font-semibold leading-none tracking-[0.18em]">
            WAY
            <span className="mt-1 block text-[0.5rem] font-medium tracking-[0.32em] text-white/50">CREATIVE AGENCY</span>
          </span>
        </a>
        <nav className="type-body flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          <Link to="/mentions-legales" className="transition-colors hover:text-white">Mentions légales</Link>
          <Link to="/confidentialite" className="transition-colors hover:text-white">Politique de confidentialité</Link>
          <button onClick={openCookieBanner} className="transition-colors hover:text-white">Cookies</button>
        </nav>
      </div>
      <p className="type-body mt-6 text-center text-xs text-white/50 sm:text-right">
        © 2026 WAY Agency — Tous droits réservés
      </p>
    </footer>
  );
}
