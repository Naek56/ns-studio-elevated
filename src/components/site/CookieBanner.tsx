import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getConsent, setConsent, startKairosTracking, type ConsentValue } from "@/lib/consent";
import { sfxTap, sfxSuccess } from "@/lib/sfx";

/* Bannière de consentement — minimale : un titre, une phrase, deux boutons.
   Signature WAY : un liseré bleu lumineux en haut de la carte. */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [masked, setMasked] = useState(false); // fiche de RDV ouverte par-dessus

  useEffect(() => {
    const onModal = (e: Event) => setMasked(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("way:modal", onModal as EventListener);
    return () => window.removeEventListener("way:modal", onModal as EventListener);
  }, []);

  useEffect(() => {
    if (getConsent() === "accepted") startKairosTracking();

    // la bannière s'affiche à CHAQUE visite. Sur le site agence elle attend la
    // fin de l'animation pixel ; ailleurs (dont le nouvel accueil, qui n'a pas
    // d'intro) elle arrive simplement après un court délai.
    const show = () => setOpen(true);
    const path = window.location.pathname;
    let introDone = true;
    try { introDone = sessionStorage.getItem("way-revealed") === "1"; } catch { /* noop */ }
    // "/" : l'intro « way » pose un drapeau quand elle a fini — on attend
    // toujours ce moment pour ne pas recouvrir l'animation.
    const homeIntroRunning =
      path === "/" && !(window as unknown as { __wayRevealed?: boolean }).__wayRevealed;
    const agencyIntroRunning = path === "/agence" && !introDone;

    let t: number | undefined;
    if (homeIntroRunning || agencyIntroRunning) window.addEventListener("way:revealed", show, { once: true });
    else t = window.setTimeout(show, 400);

    const reopen = () => setOpen(true);
    window.addEventListener("way:openCookies", reopen);
    return () => {
      window.removeEventListener("way:openCookies", reopen);
      window.removeEventListener("way:revealed", show);
      if (t) window.clearTimeout(t);
    };
  }, []);

  const choose = (value: ConsentValue) => {
    if (value === "accepted") sfxSuccess(); else sfxTap();
    setConsent(value);
    setOpen(false);
  };
  // fermeture sans choix : la bannière reviendra à la prochaine visite
  const dismiss = () => { sfxTap(); setOpen(false); };

  return (
    <AnimatePresence>
      {open && !masked && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[120] flex justify-start px-3 pb-3 sm:px-5 sm:pb-5"
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div
            className="relative w-full max-w-[370px] overflow-hidden rounded-2xl border border-white/12 p-5"
            style={{
              background: "linear-gradient(168deg, #0d1c33 0%, #0a1526 60%, #070f1d 100%)",
              boxShadow: "0 22px 48px -22px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* liseré bleu lumineux — la touche WAY */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #63b3dd 22%, #8ecbe8 50%, #63b3dd 78%, transparent)" }}
            />

            <button
              onClick={dismiss}
              aria-label="Fermer"
              className="absolute right-4 top-4 text-white/35 transition-colors hover:text-white/80"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="type-body pr-8 text-[15px] font-semibold text-white">
              On aime savoir ce qui vous plaît <span aria-hidden>🍪</span>
            </p>
            <p className="type-body mt-1.5 text-[13px] leading-relaxed text-white/55">
              Des cookies analytiques nous aident à améliorer votre expérience.{" "}
              <Link to="/confidentialite" className="whitespace-nowrap text-white/75 underline underline-offset-2 transition-colors hover:text-white">
                En savoir plus
              </Link>
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <button
                onClick={() => choose("accepted")}
                className="type-body rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-neutral-900 transition-all duration-200 hover:brightness-95"
              >
                Accepter
              </button>
              <button
                onClick={() => choose("refused")}
                className="type-body rounded-lg border border-white/15 px-4 py-2 text-[13px] font-medium text-white/80 transition-colors duration-200 hover:border-white/30 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                Refuser
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
