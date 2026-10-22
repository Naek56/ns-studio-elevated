import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { clientId: string } };

// GET /api/clients/[clientId] — détail d'un client
export async function GET(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_clients")
    .select("*")
    .eq("client_id", params.clientId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  return NextResponse.json({ client: data });
}

// PATCH /api/clients/[clientId] — met à jour un client (ex: concurrents, actif)
export async function PATCH(req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const allowed: Record<string, unknown> = {};
  for (const key of ["nom", "url", "objectif", "secteur", "email", "actif", "concurrents"]) {
    if (key in body) allowed[key] = body[key];
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_clients")
    .update(allowed)
    .eq("client_id", params.clientId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}

// DELETE /api/clients/[clientId] — supprime un client et ses données
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const id = params.clientId;
  await Promise.all([
    admin.from("kairos_events").delete().eq("client_id", id),
    admin.from("kairos_rapports").delete().eq("client_id", id),
    admin.from("kairos_concurrents").delete().eq("client_id", id),
    admin.from("kairos_messages").delete().eq("client_id", id),
  ]);
  const { error } = await admin.from("kairos_clients").delete().eq("client_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
