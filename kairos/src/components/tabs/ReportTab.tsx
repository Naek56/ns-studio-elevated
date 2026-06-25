"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles, Loader2, Clock } from "lucide-react";
import clsx from "clsx";
import type { KairosClient, KairosRapport } from "@/lib/types";
import HealthScore from "@/components/HealthScore";
import ReportMarkdown from "@/components/ReportMarkdown";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportTab({ client }: { client: KairosClient }) {
  const [reports, setReports] = useState<KairosRapport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/clients/${client.client_id}/reports`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list: KairosRapport[] = data.rapports || [];
      setReports(list);
      setSelectedId((prev) => prev ?? list[0]?.id ?? null);
    }
    setLoading(false);
  }, [client.client_id]);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/clients/${client.client_id}/reports`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        await load();
        setSelectedId(data.rapport.id);
      } else {
        setError(data.error || "Échec de la génération.");
      }
    } catch {
      setError("Erreur réseau pendant la génération.");
    } finally {
      setGenerating(false);
    }
  }

  const { selected, previousScore } = useMemo(() => {
    const idx = reports.findIndex((r) => r.id === selectedId);
    const sel = idx >= 0 ? reports[idx] : reports[0] || null;
    // Le rapport suivant (plus ancien) sert de référence "mois précédent".
    const prev = idx >= 0 && idx + 1 < reports.length ? reports[idx + 1] : null;
    return { selected: sel, previousScore: prev?.score ?? null };
  }, [reports, selectedId]);

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">Rapport d'analyse</h2>
          <p className="mt-1 font-mono text-xs text-kairos-muted">
            Observation → Analyse → Stratégie, en 3 passes Claude.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="flex items-center gap-2 rounded-md bg-kairos-accent px-5 py-3 font-mono text-xs uppercase tracking-wider font-medium text-black transition hover:bg-kairos-accent-dim disabled:opacity-50"
        >
          {generating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {generating ? "Génération en cours…" : "Générer un rapport maintenant"}
        </button>
      </div>

      {generating && (
        <p className="mt-4 font-mono text-xs text-kairos-muted">
          Capture des pages, lecture des events des 7 derniers jours et
          raisonnement de Kairos… cela peut prendre une à deux minutes.
        </p>
      )}
      {error && <p className="mt-4 font-mono text-xs text-kairos-red">{error}</p>}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 font-mono text-sm text-kairos-muted">
          <Loader2 size={16} className="animate-spin" /> Chargement des rapports…
        </div>
      ) : !selected ? (
        <div className="mt-10 rounded-lg border border-dashed border-kairos-border p-10 text-center">
          <p className="font-mono text-sm text-kairos-muted">
            Aucun rapport pour {client.nom}. Lancez la première analyse.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <HealthScore score={selected.score} previous={previousScore} />
          </div>

          <div className="mt-6 rounded-lg border border-kairos-border bg-kairos-bg p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-kairos-muted">
              Rapport du {formatDate(selected.created_at)}
            </p>
            <ReportMarkdown content={selected.rapport || "(rapport vide)"} />
          </div>

          {/* Historique */}
          {reports.length > 1 && (
            <div className="mt-10">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-kairos-muted">
                Rapports précédents
              </p>
              <ul className="space-y-1.5">
                {reports.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedId(r.id)}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-md border px-4 py-3 font-mono text-sm transition",
                        r.id === selected.id
                          ? "border-kairos-accent/50 bg-kairos-elevated text-white"
                          : "border-kairos-border bg-kairos-panel text-kairos-text/80 hover:bg-kairos-elevated/60"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Clock size={13} className="text-kairos-muted" />
                        {formatDate(r.created_at)}
                      </span>
                      <span
                        className={clsx(
                          "rounded px-2 py-0.5 text-xs",
                          (r.score ?? 0) >= 75
                            ? "bg-kairos-green/15 text-kairos-green"
                            : (r.score ?? 0) >= 50
                              ? "bg-kairos-accent/15 text-kairos-accent"
                              : "bg-kairos-red/15 text-kairos-red"
                        )}
                      >
                        {r.score ?? "—"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
