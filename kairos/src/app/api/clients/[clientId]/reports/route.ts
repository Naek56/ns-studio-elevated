import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import { summarizeEvents } from "@/lib/events";
import { takeScreenshots } from "@/lib/screenshotone";
import { runObservation, runAnalysis, runStrategy } from "@/lib/anthropic";
import type { KairosClient, KairosEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: { clientId: string } };

// GET /api/clients/[clientId]/reports — liste des rapports (récent → ancien)
export async function GET(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_rapports")
    .select("*")
    .eq("client_id", params.clientId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rapports: data || [] });
}

// POST /api/clients/[clientId]/reports — génère un rapport (Observation → Analyse → Stratégie)
export async function POST(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();

  const { data: client } = await admin
    .from("kairos_clients")
    .select("*")
    .eq("client_id", params.clientId)
    .maybeSingle<KairosClient>();
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  // 1. Events des 7 derniers jours
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: events } = await admin
    .from("kairos_events")
    .select("*")
    .eq("client_id", client.client_id)
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(5000);

  const summary = summarizeEvents((events || []) as KairosEvent[], 7);

  // 2. Screenshots : page d'accueil + pages les plus vues
  const urls = pagesToCapture(client, summary.pages.map((p) => p.page));

  try {
    const screenshots = await takeScreenshots(urls);

    // 3. Pipeline Claude
    const observation = await runObservation(client, summary, screenshots);
    const analyse = await runAnalysis(observation, screenshots);
    const { rapport, score } = await runStrategy(client, summary, observation, analyse);

    // 4. Sauvegarde
    const { data: saved, error } = await admin
      .from("kairos_rapports")
      .insert({
        client_id: client.client_id,
        observation,
        analyse,
        rapport,
        score,
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ rapport: saved }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de la génération.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Construit la liste d'URLs à screenshotter (accueil + top pages), max 6. */
function pagesToCapture(client: KairosClient, topPaths: string[]): string[] {
  const urls: string[] = [client.url];
  let origin = "";
  try {
    const u = client.url.startsWith("http") ? client.url : `https://${client.url}`;
    origin = new URL(u).origin;
  } catch {
    origin = "";
  }

  for (const p of topPaths) {
    if (!p || p === "(inconnu)") continue;
    if (/^https?:\/\//i.test(p)) {
      urls.push(p);
    } else if (origin) {
      urls.push(`${origin}${p.startsWith("/") ? "" : "/"}${p}`);
    }
    if (urls.length >= 6) break;
  }
  return Array.from(new Set(urls)).slice(0, 6);
}
