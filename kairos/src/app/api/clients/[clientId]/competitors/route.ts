import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import { takeScreenshots } from "@/lib/screenshotone";
import { runVeilleur } from "@/lib/anthropic";
import type { KairosClient } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Params = { params: { clientId: string } };

// GET — historique des analyses concurrentielles
export async function GET(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_concurrents")
    .select("*")
    .eq("client_id", params.clientId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ analyses: data || [] });
}

// POST — analyse les concurrents (screenshots + module Veilleur)
export async function POST(req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: { urls?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const competitorUrls = (body.urls || [])
    .map((u) => String(u).trim())
    .filter(Boolean)
    .slice(0, 8);

  if (competitorUrls.length === 0) {
    return NextResponse.json({ error: "Au moins une URL concurrente est requise." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: client } = await admin
    .from("kairos_clients")
    .select("*")
    .eq("client_id", params.clientId)
    .maybeSingle<KairosClient>();
  if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  try {
    const [clientShots, competitorShots] = await Promise.all([
      takeScreenshots([client.url]),
      takeScreenshots(competitorUrls),
    ]);

    const resultat = await runVeilleur(client, clientShots, competitorShots);

    // Sauvegarde de l'analyse + mémorisation des URLs sur le client
    const { data: saved, error } = await admin
      .from("kairos_concurrents")
      .insert({ client_id: client.client_id, urls: competitorUrls, resultat })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin
      .from("kairos_clients")
      .update({ concurrents: competitorUrls })
      .eq("client_id", client.client_id);

    return NextResponse.json({ analyse: saved }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'analyse.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
