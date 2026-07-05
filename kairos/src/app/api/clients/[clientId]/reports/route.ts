import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import { summarizeEvents } from "@/lib/events";
import { runRapportComplet } from "@/lib/anthropic";
import type { KairosClient, KairosEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

// POST /api/clients/[clientId]/reports — génère un rapport (1 appel Claude, sans screenshots)
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

  try {
    // 2. Appel Claude unique
    const { rapport, score } = await runRapportComplet(client, summary);

    // 3. Sauvegarde
    const { data: saved, error } = await admin
      .from("kairos_rapports")
      .insert({
        client_id: client.client_id,
        observation: null,
        analyse: null,
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
