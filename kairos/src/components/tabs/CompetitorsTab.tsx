"use client";

import { useCallback, useEffect, useState } from "react";
import { Swords, Loader2, Clock } from "lucide-react";
import clsx from "clsx";
import type { KairosClient, KairosConcurrent } from "@/lib/types";
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

export default function CompetitorsTab({ client }: { client: KairosClient }) {
  const [urlsText, setUrlsText] = useState((client.concurrents || []).join("\n"));
  const [analyses, setAnalyses] = useState<KairosConcurrent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/clients/${client.client_id}/competitors`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list: KairosConcurrent[] = data.analyses || [];
      setAnalyses(list);
      setSelectedId((prev) => prev ?? list[0]?.id ?? null);
    }
    setLoading(false);
  }, [client.client_id]);

  useEffect(() => {
    load();
  }, [load]);

  async function analyze() {
    const urls = urlsText
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      setError("Entrez au moins une URL de concurrent.");
      return;
    }
    setRunning(true);
    setError("");
    try {
      const res = await fetch(`/api/clients/${client.client_id}/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (res.ok) {
        await load();
        setSelectedId(data.analyse.id);
      } else {
        setError(data.error || "Échec de l'analyse.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setRunning(false);
    }
  }

  const selected = analyses.find((a) => a.id === selectedId) || analyses[0] || null;

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h2 className="font-display text-2xl text-white">Veille concurrentielle</h2>
      <p className="mt-1 font-mono text-xs text-kairos-muted">
        Kairos compare le site du client aux concurrents (une URL par ligne).
      </p>

      <div className="mt-6">
        <textarea
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          rows={4}
          placeholder={"https://concurrent-1.com\nhttps://concurrent-2.com"}
          className="w-full resize-y rounded-md border border-kairos-border bg-kairos-bg px-4 py-3 font-mono text-sm text-kairos-text outline-none transition focus:border-kairos-accent"
        />
        <div className="mt-3 flex items-center justify-between">
          {error ? (
            <p className="font-mono text-xs text-kairos-red">{error}</p>
          ) : (
            <span />
          )}
          <button
            onClick={analyze}
            disabled={running}
            className="flex items-center gap-2 rounded-md bg-kairos-accent px-5 py-3 font-mono text-xs uppercase tracking-wider font-medium text-black transition hover:bg-kairos-accent-dim disabled:opacity-50"
          >
            {running ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Swords size={15} />
            )}
            {running ? "Analyse en cours…" : "Analyser les concurrents"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center gap-2 font-mono text-sm text-kairos-muted">
          <Loader2 size={16} className="animate-spin" /> Chargement…
        </div>
      ) : selected ? (
        <>
          <div className="mt-8 rounded-lg border border-kairos-border bg-kairos-bg p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-kairos-muted">
              Analyse du {formatDate(selected.created_at)} ·{" "}
              {(selected.urls || []).length} concurrent
              {(selected.urls || []).length > 1 ? "s" : ""}
            </p>
            <ReportMarkdown content={selected.resultat || "(résultat vide)"} />
          </div>

          {analyses.length > 1 && (
            <div className="mt-10">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-kairos-muted">
                Analyses précédentes
              </p>
              <ul className="space-y-1.5">
                {analyses.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelectedId(a.id)}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-md border px-4 py-3 font-mono text-sm transition",
                        a.id === selected.id
                          ? "border-kairos-accent/50 bg-kairos-elevated text-white"
                          : "border-kairos-border bg-kairos-panel text-kairos-text/80 hover:bg-kairos-elevated/60"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Clock size={13} className="text-kairos-muted" />
                        {formatDate(a.created_at)}
                      </span>
                      <span className="text-kairos-muted">
                        {(a.urls || []).length} URL
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-kairos-border p-10 text-center">
          <p className="font-mono text-sm text-kairos-muted">
            Aucune analyse concurrentielle pour l'instant.
          </p>
        </div>
      )}
    </div>
  );
}
