import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { sfxTap, sfxWhoosh, sfxSend } from "@/lib/sfx";

/*
  Prise de rendez-vous : le visiteur laisse son e-mail, choisit une date et un
  créneau, puis confirme. L'envoi passe par FormSubmit (aucun serveur requis) ;
  la toute première demande déclenche un mail de confirmation à cette adresse.
  ⚠️ L'adresse est visible dans le code du site.
*/
const CONTACT_EMAIL = "samsonnae10@gmail.com";

export function openContact() {
  window.dispatchEvent(new Event("way:openContact"));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* créneaux proposés : 09:00 → 17:30, toutes les 30 minutes */
const SLOTS = Array.from({ length: 18 }, (_, i) => {
  const m = 9 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
});

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date) => !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("way:openContact", onOpen);
    return () => window.removeEventListener("way:openContact", onOpen);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Lenis fait défiler la page par programmation : overflow:hidden ne suffit
    // pas, il faut l'arrêter explicitement pendant l'ouverture de la fiche.
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (!open) {
      root.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
      return;
    }
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    lenis?.stop();
    sfxWhoosh();
    root.classList.add("modal-open"); // curseur natif visible sur le formulaire
    // masque la bannière cookies tant que la fiche est ouverte (elle la couvrait)
    window.dispatchEvent(new CustomEvent("way:modal", { detail: true }));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    // bloque aussi la molette / le tactile qui ne visent pas la fiche
    const block = (e: Event) => { if (!(e.target as Element)?.closest?.("[data-modal-card]")) e.preventDefault(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      root.style.overflow = "";
      document.body.style.overflow = "";
      root.classList.remove("modal-open");
      lenis?.start();
      window.dispatchEvent(new CustomEvent("way:modal", { detail: false }));
    };
  }, [open]);

  const close = () => {
    sfxTap();
    setOpen(false);
    window.setTimeout(() => {
      setStatus("idle"); setErrors({}); setEmail(""); setDate(null); setTime(null);
      setView({ y: today.getFullYear(), m: today.getMonth() });
    }, 350);
  };

  /* grille du mois affiché (semaine commençant le lundi) */
  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;            // lundi = 0
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) cells.push(new Date(view.y, view.m, d));
    return cells;
  }, [view]);

  // week-ends et jours passés : indisponibles
  const unavailable = (d: Date) => d < today || d.getDay() === 0 || d.getDay() === 6;
  const atFirstMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const move = (step: number) => {
    sfxTap();
    setView((v) => {
      const n = new Date(v.y, v.m + step, 1);
      return { y: n.getFullYear(), m: n.getMonth() };
    });
  };

  const pickDay = (d: Date) => {
    if (unavailable(d)) return;
    sfxTap();
    setDate(d);
    setErrors((e) => { const n = { ...e }; delete n.date; return n; });
  };
  const pickTime = (t: string) => {
    sfxTap();
    setTime(t);
    setErrors((e) => { const n = { ...e }; delete n.date; return n; });
  };

  const prettyDate = date
    ? date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : null;

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "sending") return;
    const e: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) e.email = "Adresse mail invalide";
    if (!date || !time) e.date = "Choisissez une date et un créneau";
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Email: email,
          Date: prettyDate,
          Heure: time,
          _subject: `Nouveau rendez-vous — ${prettyDate} à ${time}`,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      sfxSend();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: "rgba(8,21,43,0.75)" }} onClick={close} />

          <motion.div
            data-modal-card
            className="relative z-10 max-h-[94vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
            style={{ background: "linear-gradient(160deg, #16305a 0%, #0e1e3a 60%, #0a1730 100%)" }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={close} aria-label="Fermer" className="absolute right-5 top-5 z-20 text-white/50 transition-colors hover:text-white">
              <X className="h-5 w-5" />
            </button>

            {status === "sent" ? (
              <div className="flex flex-col items-center px-7 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30">
                  <Check className="h-6 w-6 text-white" />
                </span>
                <h3 className="display-xl mt-6 text-2xl font-semibold text-white">Rendez-vous demandé.</h3>
                <p className="mt-2 text-sm text-white/60">
                  {prettyDate} à {time} — on vous confirme ça par mail très vite.
                </p>
                <button onClick={close} className="mt-8 rounded-full border border-white/40 px-6 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-[#0e1e3a]">Fermer</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="px-6 pt-5 sm:px-7">
                  <p className="label">Parlons de votre projet</p>
                  <h3 className="display-xl mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                    Réservez un créneau. <span className="type-body text-sm font-normal text-white/50">30 min, en visio.</span>
                  </h3>
                </div>

                <div className="mt-4 grid gap-5 px-6 sm:grid-cols-[1fr_auto] sm:px-7">
                  {/* ── calendrier ── */}
                  <div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => move(-1)} disabled={atFirstMonth}
                        aria-label="Mois précédent"
                        className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <p className="type-body text-sm font-semibold text-white">{MONTHS[view.m]} {view.y}</p>
                      <button type="button" onClick={() => move(1)} aria-label="Mois suivant"
                        className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                      {WEEKDAYS.map((w) => (
                        <span key={w} className="type-body py-0.5 text-[11px] font-medium text-white/40">{w}</span>
                      ))}
                      {grid.map((d, i) =>
                        d === null ? <span key={`e${i}`} /> : (
                          <button
                            key={d.toISOString()}
                            type="button"
                            onClick={() => pickDay(d)}
                            disabled={unavailable(d)}
                            aria-label={d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                            className={[
                              "type-body flex h-8 items-center justify-center rounded-lg text-[13px] tabular-nums transition-colors",
                              unavailable(d)
                                ? "text-white/20 line-through"
                                : sameDay(date, d)
                                  ? "bg-white font-semibold text-neutral-900"
                                  : "text-white/85 hover:bg-white/10",
                              !unavailable(d) && !sameDay(date, d) && sameDay(today, d) ? "ring-1 ring-inset ring-white/35" : "",
                            ].join(" ")}
                          >
                            {d.getDate()}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* ── créneaux ── */}
                  <div className="sm:w-[212px]">
                    <p className="type-body mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Créneaux</p>
                    {/* grille : tous les créneaux visibles, aucun défilement */}
                    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-3">
                      {SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => pickTime(t)}
                          className={[
                            "type-body rounded-lg border px-1 py-1.5 text-[12.5px] tabular-nums transition-colors",
                            time === t
                              ? "border-white bg-white font-semibold text-neutral-900"
                              : "border-white/15 text-white/80 hover:border-white/35 hover:text-white",
                          ].join(" ")}
                          style={time === t ? undefined : { background: "rgba(255,255,255,0.05)" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── e-mail + confirmation, sur une seule ligne ── */}
                <div className="mt-4 border-t border-white/12 px-6 pt-4 sm:px-7">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => { const n = { ...x }; delete n.email; return n; }); }}
                      placeholder="Votre e-mail"
                      aria-label="Votre e-mail"
                      className="w-full flex-1 rounded-lg border border-white/20 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#63b3dd]"
                      style={errors.email ? { borderColor: "rgba(248,113,113,0.7)" } : undefined}
                    />
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="type-body shrink-0 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:brightness-95 disabled:opacity-60"
                    >
                      {status === "sending" ? "Envoi…" : "Confirmer"}
                    </button>
                  </div>

                  <p className="type-body mt-2.5 text-[12.5px] text-white/60">
                    {errors.email ? (
                      <span className="text-red-400">{errors.email}</span>
                    ) : status === "error" ? (
                      <span className="text-red-400">Une erreur est survenue. Réessayez dans un instant.</span>
                    ) : date && time ? (
                      <>Rendez-vous le <span className="font-semibold text-white">{prettyDate}</span> à <span className="font-semibold text-white">{time}</span>.</>
                    ) : (
                      <span className={errors.date ? "text-red-400" : ""}>Choisissez une date et un créneau.</span>
                    )}
                  </p>
                </div>

                <p className="px-6 pb-5 pt-3 text-[0.68rem] leading-snug text-white/35 sm:px-7">
                  En confirmant, votre e-mail sert uniquement à organiser ce rendez-vous —{" "}
                  <Link to="/confidentialite" onClick={close} className="underline underline-offset-2 transition-colors hover:text-white">
                    confidentialité
                  </Link>.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
