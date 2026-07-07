"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, Radio, Swords, MessageSquare } from "lucide-react";
import clsx from "clsx";
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

export default function ClientWorkspace({ client }: { client: KairosClient }) {
  const [tab, setTab] = useState<TabKey>("rapport");

  return (
    <div className="flex h-full flex-col">
      {/* En-tête client */}
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

          <a
            href={`/api/clients/${client.client_id}/tracker`}
            download="kairos-tracker.js"
            className="flex items-center gap-2 rounded-md border border-kairos-border bg-kairos-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-kairos-text transition hover:border-kairos-accent hover:text-kairos-accent"
          >
            <Download size={14} /> Télécharger le script
          </a>
        </div>

        {/* Onglets */}
        <nav className="mt-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
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

      {/* Contenu de l'onglet */}
      <div className="flex-1 overflow-y-auto">
        {tab === "rapport" && <ReportTab client={client} />}
        {tab === "live" && <LiveTab client={client} />}
        {tab === "concurrents" && <CompetitorsTab client={client} />}
        {tab === "chat" && <ChatTab client={client} />}
      </div>
    </div>
  );
}
