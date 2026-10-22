import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { callApi } from "@/lib/api";
import type { KairosClient } from "@/lib/types";

type Props = {
  onClose: () => void;
  onCreated: (clientId: string) => void;
};

export default function NewClientModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    nom: "",
    url: "",
    objectif: "",
    secteur: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await callApi<{ client: KairosClient }>("clients", "create", { ...form });
      onCreated(data.client.client_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  const fields: Array<{ key: keyof typeof form; label: string; placeholder: string; required?: boolean }> = [
    { key: "nom", label: "Nom du client", placeholder: "Acme Studio", required: true },
    { key: "url", label: "URL du site", placeholder: "https://acme.com", required: true },
    { key: "objectif", label: "Objectif", placeholder: "Augmenter les demandes de devis" },
    { key: "secteur", label: "Secteur", placeholder: "Architecture d'intérieur" },
    { key: "email", label: "Email", placeholder: "contact@acme.com" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-kairos-border bg-kairos-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">Nouveau client</h2>
            <p className="mt-1 font-mono text-xs text-kairos-muted">
              Un client_id et un script de tracking seront générés.
            </p>
          </div>
          <button onClick={onClose} className="text-kairos-muted hover:text-kairos-text">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-kairos-muted">
                {f.label}
                {f.required && <span className="text-kairos-accent"> *</span>}
              </label>
              <input
                value={form[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
                className="w-full rounded-md border border-kairos-border bg-kairos-surface px-3 py-2.5 font-mono text-sm text-kairos-text outline-none transition focus:border-kairos-accent"
              />
            </div>
          ))}

          {error && <p className="font-mono text-xs text-kairos-red">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-kairos-border px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-kairos-muted transition hover:text-kairos-text"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-kairos-accent px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-medium text-black transition hover:bg-kairos-accent-dim disabled:opacity-40"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
