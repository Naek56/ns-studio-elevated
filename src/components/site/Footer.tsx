import { Link } from "react-router-dom";
import Logo from "./Logo";
import { openCookieBanner } from "@/lib/consent";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-[1600px] border-t border-white/10 px-6 pt-8 pb-6">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45">
          <Link to="/mentions-legales" className="transition-colors hover:text-white">
            Mentions légales
          </Link>
          <Link to="/confidentialite" className="transition-colors hover:text-white">
            Politique de confidentialité
          </Link>
          <button onClick={openCookieBanner} className="transition-colors hover:text-white">
            Cookies
          </button>
        </nav>
      </div>
      <p className="mt-6 text-center text-xs text-white/40 sm:text-right">
        © 2026 WAY Agency — Tous droits réservés
      </p>
    </footer>
  );
}
