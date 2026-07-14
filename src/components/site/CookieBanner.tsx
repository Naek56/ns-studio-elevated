import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Check } from "lucide-react";
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
          className="fixed inset-x-0 bottom-0 z-[120] flex justify-center px-3 pb-3 sm:px-4 sm:pb-4"
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-6"
            style={{
              background: "linear-gradient(160deg, #16161a 0%, #0c0c10 60%, #060608 100%)",
              boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* halo décoratif */}
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)" }} />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15" style={{ background: "rgba(255,255,255,0.06)" }}>
                <Cookie className="h-5 w-5 text-[#8ecbe8]" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="type-body text-sm font-semibold text-white">On aime savoir ce qui vous plaît</p>
                <p className="type-body mt-1 text-[13px] leading-relaxed text-white/65">
                  Des cookies analytiques nous aident à améliorer votre expérience. Rien n'est vendu ni partagé.{" "}
                  <Link to="/confidentialite" className="whitespace-nowrap text-[#8ecbe8] underline underline-offset-2 transition-colors hover:text-white">
                    En savoir plus
                  </Link>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:flex-col-reverse sm:items-stretch sm:gap-2">
                <button
                  onClick={() => choose("refused")}
                  className="type-body text-[13px] font-medium text-white/55 transition-colors hover:text-white/90"
                >
                  Refuser
                </button>
                <button
                  onClick={() => choose("accepted")}
                  className="type-body group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-300 hover:brightness-105"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.5), 0 10px 26px -8px rgba(255,255,255,0.4)" }}
                >
                  <Check className="h-4 w-4" />
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
