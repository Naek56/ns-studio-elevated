import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

type IncomingEvent = {
  type?: string;
  page?: string;
  data?: Record<string, unknown>;
};

export async function POST(req: Request) {
  let body: { client_id?: string; session_id?: string; events?: IncomingEvent[] };
  try {
    // Le tracker envoie en text/plain (évite le preflight CORS).
    const raw = await req.text();
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400, headers: CORS });
  }

  const clientId = body.client_id;
  const events = Array.isArray(body.events) ? body.events : [];
  if (!clientId || events.length === 0) {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  try {
    const admin = createAdminClient();

    // On vérifie que le client existe (et on ignore silencieusement sinon).
    const { data: client } = await admin
      .from("kairos_clients")
      .select("client_id")
      .eq("client_id", clientId)
      .maybeSingle();
    if (!client) {
      return new NextResponse(null, { status: 204, headers: CORS });
    }

    const rows = events.slice(0, 100).map((e) => ({
      client_id: clientId,
      session_id: body.session_id ?? null,
      type: String(e.type || "unknown").slice(0, 40),
      page: e.page ? String(e.page).slice(0, 512) : null,
      data: e.data && typeof e.data === "object" ? e.data : {},
    }));

    await admin.from("kairos_events").insert(rows);
  } catch {
    // On ne révèle rien au client externe ; on accuse simplement réception.
  }

  return new NextResponse(null, { status: 204, headers: CORS });
}
