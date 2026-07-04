import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";

/*
  Où arrivent les demandes :
  Remplace la valeur ci-dessous par TON adresse mail. Les envois passent par
  FormSubmit (aucun serveur requis). La toute première demande déclenche un mail
  de confirmation à cette adresse : clique le lien pour activer la réception.
*/
const CONTACT_EMAIL = "REMPLACE-MOI@exemple.com";

export function openContact() {
  window.dispatchEvent(new Event("way:openContact"));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const empty = { prenom: "", nom: "", entreprise: "", projet: "", email: "" };

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("way:openContact", onOpen);
    return () => window.removeEventListener("way:openContact", onOpen);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => { setStatus("idle"); setErrors({}); setForm({ ...empty }); }, 350);
  };

  const set = (k: keyof typeof empty, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = "Champ requis";
    if (!form.nom.trim()) e.nom = "Champ requis";
    if (!form.projet.trim()) e.projet = "Décrivez votre projet";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Adresse mail invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Prénom: form.prenom,
          Nom: form.nom,
          Entreprise: form.entreprise || "—",
          Projet: form.projet,
          Email: form.email,
          _subject: `Nouvelle demande — ${form.prenom} ${form.nom}`,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field = (
    label: string,
    key: keyof typeof empty,
    opts: { type?: string; placeholder?: string; textarea?: boolean; optional?: boolean } = {}
  ) => (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-white/45">
          {label}{opts.optional ? "" : " *"}
        </span>
        {errors[key] && <span className="text-[0.7rem] text-red-400">{errors[key]}</span>}
      </span>
      {opts.textarea ? (
        <textarea
          rows={2}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder}
          className="w-full resize-none rounded-md border border-white/15 bg-white/[0.03] px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/50"
        />
      ) : (
        <input
          type={opts.type || "text"}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder}
          className="w-full rounded-md border border-white/15 bg-white/[0.03] px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/50"
          style={errors[key] ? { borderColor: "rgba(248,113,113,0.7)" } : undefined}
        />
      )}
    </label>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />

          <motion.div
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/12 bg-[#0b0b0d] p-7 shadow-2xl sm:p-9"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={close} aria-label="Fermer" className="absolute right-5 top-5 text-white/50 transition-colors hover:text-white">
              <X className="h-5 w-5" />
            </button>

            {status === "sent" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30">
                  <Check className="h-6 w-6 text-white" />
                </span>
                <h3 className="display-xl mt-6 text-2xl font-semibold text-white">Message envoyé.</h3>
                <p className="mt-2 text-sm text-white/55">On revient vers vous très vite.</p>
                <button onClick={close} className="btn-line mt-8 text-sm">Fermer</button>
              </div>
            ) : (
              <>
                <p className="label">Parlons de votre projet</p>
                <h3 className="display-xl mt-3 text-2xl font-semibold text-white sm:text-3xl">Démarrons ensemble.</h3>

                <form onSubmit={submit} noValidate className="mt-7 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("Prénom", "prenom", { placeholder: "Jean" })}
                    {field("Nom", "nom", { placeholder: "Dupont" })}
                  </div>
                  {field("Entreprise", "entreprise", { placeholder: "Votre société", optional: true })}
                  {field("Votre projet", "projet", { textarea: true, placeholder: "En deux lignes, parlez-nous de votre projet…" })}
                  {field("Adresse mail", "email", { type: "email", placeholder: "jean@societe.com" })}

                  {status === "error" && (
                    <p className="text-sm text-red-400">Une erreur est survenue. Réessayez dans un instant.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-line group w-full justify-center text-sm disabled:opacity-60"
                  >
                    {status === "sending" ? "Envoi…" : "Envoyer la demande"}
                    {status !== "sending" && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </button>

                  <p className="text-[0.7rem] leading-relaxed text-white/40">
                    En soumettant ce formulaire vous acceptez que vos données soient utilisées pour vous
                    recontacter. Voir notre{" "}
                    <Link
                      to="/confidentialite"
                      onClick={close}
                      className="underline underline-offset-2 transition-colors hover:text-white"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
