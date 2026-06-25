import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import type { KairosClient } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function generateClientId(): string {
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 14);
  return `kai_${rand}`;
}

// GET /api/clients — liste les clients + indicateur d'activité (events sur 7j)
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data: clients, error } = await admin
    .from("kairos_clients")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: recent } = await admin
    .from("kairos_events")
    .select("client_id")
    .gte("created_at", since);

  const activeSet = new Set((recent || []).map((r) => r.client_id));
  const withStatus = (clients as KairosClient[]).map((c) => ({
    ...c,
    active: activeSet.has(c.client_id),
  }));

  return NextResponse.json({ clients: withStatus });
}

// POST /api/clients — crée un client (génère client_id unique)
export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: Partial<KairosClient>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const nom = (body.nom || "").toString().trim();
  const url = (body.url || "").toString().trim();
  if (!nom || !url) {
    return NextResponse.json({ error: "Le nom et l'URL sont requis." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_clients")
    .insert({
      client_id: generateClientId(),
      nom,
      url,
      objectif: (body.objectif || "").toString().trim() || null,
      secteur: (body.secteur || "").toString().trim() || null,
      email: (body.email || "").toString().trim() || null,
      actif: true,
      concurrents: [],
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data }, { status: 201 });
}
