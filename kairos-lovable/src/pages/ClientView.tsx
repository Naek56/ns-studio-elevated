import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, ExternalLink, FileText, Radio, Swords, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { callApi } from "@/lib/api";
import { downloadTracker } from "@/lib/tracker";
import { SUPABASE_FUNCTIONS_URL } from "@/lib/supabase";
import type { KairosClient } from "@/lib/types";
import ReportTab from "@/components/tabs/ReportTab";
import LiveTab from "@/components/tabs/LiveTab";
import CompetitorsTab from "@/components/tabs/CompetitorsTab";
import ChatTab from "@/components/tabs/ChatTab";

type TabKey = "rapport" | "live" | "concurrents" | "chat";

const TABS: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  { key: "rapport", label: "Rapport", icon: <FileText size={15} /> },
  { key: "live", label: "Live", icon: <Radio size={15} /> },
  { key: "concurrents", label: "Concurrents", icon: <Swords size={15} /> },
  { key: "chat", label: "Chat Kairos", icon: <MessageSquare size={15} /> },
];

export default function ClientView() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<KairosClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("rapport");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTab("rapport");
    (async () => {
      try {
        const data = await callApi<{ client: KairosClient }>("clients", "get", { clientId });
        if (!cancelled) setClient(data.client);
      } catch {
        if (!cancelled) setClient(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-kairos-muted">
        <Loader2 size={16} className="mr-2 animate-spin" /> Chargement du client…
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-kairos-red">
        Client introuvable.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-kairos-border bg-kairos-panel px-8 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-light text-white">{client.nom}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-xs text-kairos-muted">
              <a
                href={client.url.startsWith("http") ? client.url : `https://${client.url}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-kairos-accent"
              >
                {client.url} <ExternalLink size={11} />
              </a>
              {client.secteur && <span>· {client.secteur}</span>}
            </div>
          </div>

          <button
            onClick={() => downloadTracker(client.client_id, SUPABASE_FUNCTIONS_URL)}
            className="flex items-center gap-2 rounded-md border border-kairos-border bg-kairos-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-kairos-text transition hover:border-kairos-accent hover:text-kairos-accent"
          >
            <Download size={14} /> Télécharger le script
          </button>
        </div>

        <nav className="mt-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition",
                tab === t.key
                  ? "border-kairos-accent text-white"
                  : "border-transparent text-kairos-muted hover:text-kairos-text"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto">
        {tab === "rapport" && <ReportTab client={client} />}
        {tab === "live" && <LiveTab client={client} />}
        {tab === "concurrents" && <CompetitorsTab client={client} />}
        {tab === "chat" && <ChatTab client={client} />}
      </div>
    </div>
  );
}
