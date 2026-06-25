import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import { summarizeEvents } from "@/lib/events";
import { runChat } from "@/lib/anthropic";
import type { KairosClient, KairosEvent, KairosMessage, KairosRapport } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Params = { params: { clientId: string } };

// GET — historique de la conversation
export async function GET(_req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("kairos_messages")
    .select("*")
    .eq("client_id", params.clientId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

// POST — envoie un message ; Kairos charge le contexte du client puis répond
export async function POST(req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }
  const userMessage = (body.message || "").toString().trim();
  if (!userMessage) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: client } = await admin
    .from("kairos_clients")
    .select("*")
    .eq("client_id", params.clientId)
    .maybeSingle<KairosClient>();
  if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  // Contexte chargé automatiquement : 3 derniers rapports, events 7j, historique
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [rapportsRes, eventsRes, historyRes] = await Promise.all([
    admin
      .from("kairos_rapports")
      .select("*")
      .eq("client_id", client.client_id)
      .order("created_at", { ascending: false })
      .limit(3),
    admin
      .from("kairos_events")
      .select("*")
      .eq("client_id", client.client_id)
      .gte("created_at", since)
      .limit(5000),
    admin
      .from("kairos_messages")
      .select("*")
      .eq("client_id", client.client_id)
      .order("created_at", { ascending: true })
      .limit(40),
  ]);

  const summary = summarizeEvents((eventsRes.data || []) as KairosEvent[], 7);
  const rapports = (rapportsRes.data || []) as KairosRapport[];
  const history = (historyRes.data || []) as KairosMessage[];

  try {
    const reply = await runChat(client, rapports, summary, history, userMessage);

    await admin.from("kairos_messages").insert([
      { client_id: client.client_id, role: "user", content: userMessage },
      { client_id: client.client_id, role: "assistant", content: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur du chat.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
