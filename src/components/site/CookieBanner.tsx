import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { getConsent, setConsent, startKairosTracking, type ConsentValue } from "@/lib/consent";
import { sfxTap, sfxSuccess } from "@/lib/sfx";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === "accepted") startKairosTracking();

    // la bannière s'affiche à CHAQUE visite, juste APRÈS l'animation pixel
    const show = () => setOpen(true);
    const onHome = window.location.pathname === "/";
    let introDone = true;
    try { introDone = sessionStorage.getItem("way-revealed") === "1"; } catch { /* noop */ }

    let t: number | undefined;
    if (onHome && !introDone) window.addEventListener("way:revealed", show, { once: true });
    else t = window.setTimeout(show, 400);

    const reopen = () => setOpen(true);
    window.addEventListener("way:openCookies", reopen);
    return () => {
      window.removeEventListener("way:openCookies", reopen);
      window.removeEventListener("way:revealed", show);
      if (t) window.clearTimeout(t);
    };
  }, []);

  const choose = (value: ConsentValue) => { if (value === "accepted") sfxSuccess(); else sfxTap(); setConsent(value); setOpen(false); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[120] flex justify-start px-3 pb-3 sm:px-5 sm:pb-5"
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div
            className="relative w-full max-w-[340px] overflow-hidden rounded-xl border border-white/15 p-3.5"
            style={{
              background: "linear-gradient(160deg, #16407e 0%, #0e2a56 58%, #0a1e40 100%)",
              boxShadow: "0 16px 40px -20px rgba(3,12,30,0.75), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {/* halo décoratif */}
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(140,203,232,0.26), transparent 70%)" }} />

            <div className="relative flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white">
                <img src="/minecraft-cookie.jpg" alt="" aria-hidden className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="type-body text-[13px] font-semibold text-white">On aime savoir ce qui vous plaît</p>
                <p className="type-body mt-0.5 text-[11.5px] leading-snug text-white/65">
                  Cookies analytiques pour améliorer votre expérience.{" "}
                  <Link to="/confidentialite" className="whitespace-nowrap text-[#8ecbe8] underline underline-offset-2 transition-colors hover:text-white">
                    En savoir plus
                  </Link>
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    onClick={() => choose("accepted")}
                    className="type-body group inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-neutral-900 transition-all duration-300 hover:brightness-105"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.5), 0 8px 18px -8px rgba(255,255,255,0.4)" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accepter
                  </button>
                  <button
                    onClick={() => choose("refused")}
                    className="type-body text-[12px] font-medium text-white/55 transition-colors hover:text-white/90"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
