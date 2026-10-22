"use client";

import { useEffect, useRef, useState } from "react";
import { Radio } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase";
import type { KairosClient } from "@/lib/types";

const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

type Session = {
  id: string;
  page: string;
  firstSeen: number;
  lastSeen: number;
};

type RawEvent = {
  session_id: string | null;
  type: string;
  page: string | null;
  created_at: string;
};

function applyEvent(map: Map<string, Session>, ev: RawEvent) {
  const sid = ev.session_id || "anon";
  if (ev.type === "session_end") {
    map.delete(sid);
    return;
  }
  const ts = new Date(ev.created_at).getTime();
  const existing = map.get(sid);
  if (existing) {
    existing.lastSeen = Math.max(existing.lastSeen, ts);
    if (ev.page && (ev.type === "pageview" || ev.type === "scroll")) {
      existing.page = ev.page;
    }
  } else {
    map.set(sid, {
      id: sid,
      page: ev.page || "/",
      firstSeen: ts,
      lastSeen: ts,
    });
  }
}

function formatDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export default function LiveTab({ client }: { client: KairosClient }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [now, setNow] = useState(Date.now());
  const [connected, setConnected] = useState(false);
  const [configured, setConfigured] = useState(true);
  const mapRef = useRef<Map<string, Session>>(new Map());

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setConfigured(false);
      return;
    }

    const supabase = createBrowserClient();
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const refresh = () => {
      const cutoff = Date.now() - ACTIVE_WINDOW_MS;
      for (const [sid, s] of mapRef.current) {
        if (s.lastSeen < cutoff) mapRef.current.delete(sid);
      }
      setSessions(
        Array.from(mapRef.current.values()).sort((a, b) => b.lastSeen - a.lastSeen)
      );
    };

    // 1. Amorçage : events des 5 dernières minutes
    (async () => {
      const since = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();
      const { data } = await supabase
        .from("kairos_events")
        .select("session_id,type,page,created_at")
        .eq("client_id", client.client_id)
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      for (const ev of (data || []) as RawEvent[]) applyEvent(mapRef.current, ev);
      refresh();
    })();

    // 2. Abonnement temps réel
    channel = supabase
      .channel(`kairos-live-${client.client_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "kairos_events",
          filter: `client_id=eq.${client.client_id}`,
        },
        (payload) => {
          applyEvent(mapRef.current, payload.new as RawEvent);
          refresh();
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    // 3. Tick pour recalculer durées + élaguer
    const ticker = setInterval(() => {
      setNow(Date.now());
      refresh();
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(ticker);
      if (channel) supabase.removeChannel(channel);
    };
  }, [client.client_id]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-8">
        <p className="font-mono text-sm text-kairos-red">
          Supabase n'est pas configuré (clés NEXT_PUBLIC manquantes). Le temps
          réel est indisponible.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">Trafic en direct</h2>
          <p className="mt-1 font-mono text-xs text-kairos-muted">
            Visiteurs actifs dans les 5 dernières minutes.
          </p>
        </div>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-kairos-muted">
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? "animate-pulse-dot bg-kairos-green" : "bg-kairos-muted"
            }`}
          />
          {connected ? "Connecté" : "Connexion…"}
        </span>
      </div>

      {/* Compteur */}
      <div className="mt-8 flex items-end gap-4 rounded-lg border border-kairos-border bg-kairos-panel p-6">
        <span className="font-display text-7xl font-light leading-none text-kairos-accent">
          {sessions.length}
        </span>
        <span className="mb-2 font-mono text-sm text-kairos-muted">
          visiteur{sessions.length > 1 ? "s" : ""} actif
          {sessions.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Liste des sessions */}
      <div className="mt-6">
        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-kairos-border p-10 text-center">
            <Radio size={20} className="mx-auto text-kairos-muted" />
            <p className="mt-3 font-mono text-sm text-kairos-muted">
              Personne en ligne en ce moment.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-md border border-kairos-border bg-kairos-panel px-4 py-3 font-mono text-sm animate-fade-in"
              >
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-kairos-green" />
                  <span className="text-white">{s.page}</span>
                </span>
                <span className="text-kairos-muted">
                  {formatDuration(now - s.firstSeen)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
