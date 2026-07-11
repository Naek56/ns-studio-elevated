import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getConsent, setConsent, startKairosTracking, type ConsentValue } from "@/lib/consent";

const MONO = "'DM Mono', ui-monospace, monospace";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // le tracking reste piloté par le choix déjà mémorisé
    if (getConsent() === "accepted") startKairosTracking();

    // la bannière s'affiche à CHAQUE visite (même si un choix existe déjà),
    // juste APRÈS l'animation pixel du début
    const show = () => setOpen(true);
    const onHome = window.location.pathname === "/";
    let introDone = true;
    try { introDone = sessionStorage.getItem("way-revealed") === "1"; } catch { /* noop */ }

    let t: number | undefined;
    if (onHome && !introDone) {
      window.addEventListener("way:revealed", show, { once: true });
    } else {
      t = window.setTimeout(show, 400); // pages légales / retour après l'intro
    }

    const reopen = () => setOpen(true);
    window.addEventListener("way:openCookies", reopen);
    return () => {
      window.removeEventListener("way:openCookies", reopen);
      window.removeEventListener("way:revealed", show);
      if (t) window.clearTimeout(t);
    };
  }, []);

  const choose = (value: ConsentValue) => {
    setConsent(value);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[120]"
          style={{
            background: "#0A0A0A",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: 20,
            fontFamily: MONO,
            fontSize: 11,
          }}
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div className="mx-auto flex max-w-[1100px] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-white/80" style={{ lineHeight: 1.7 }}>
              Ce site utilise des cookies analytiques pour analyser le comportement des visiteurs et améliorer
              votre expérience. Ces données restent confidentielles et ne sont jamais partagées.{" "}
              <Link to="/confidentialite" className="underline underline-offset-2 text-white/60 transition-colors hover:text-white">
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => choose("refused")}
                className="rounded-full border border-white bg-transparent px-5 py-2.5 uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/10"
                style={{ fontFamily: MONO, fontSize: 11 }}
              >
                Refuser
              </button>
              <button
                onClick={() => choose("accepted")}
                className="rounded-full bg-white px-5 py-2.5 uppercase tracking-[0.08em] text-black transition-opacity hover:opacity-85"
                style={{ fontFamily: MONO, fontSize: 11 }}
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
