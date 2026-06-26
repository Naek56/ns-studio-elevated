import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";

// Endpoint PUBLIC d'ingestion (verify_jwt = false dans config.toml).
// Appelé par kairos-tracker.js depuis les sites des clients.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  let body: { client_id?: string; session_id?: string; events?: Array<Record<string, unknown>> };
  try {
    // Le tracker envoie du text/plain pour éviter le preflight CORS.
    const raw = await req.text();
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Corps invalide" }, 400);
  }

  const clientId = body.client_id;
  const events = Array.isArray(body.events) ? body.events : [];
  if (!clientId || events.length === 0) {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const admin = adminClient();
    const { data: client } = await admin
      .from("kairos_clients")
      .select("client_id")
      .eq("client_id", clientId)
      .maybeSingle();
    if (!client) return new Response(null, { status: 204, headers: corsHeaders });

    const rows = events.slice(0, 100).map((e) => ({
      client_id: clientId,
      session_id: body.session_id ?? null,
      type: String(e.type || "unknown").slice(0, 40),
      page: e.page ? String(e.page).slice(0, 512) : null,
      data: e.data && typeof e.data === "object" ? e.data : {},
    }));

    await admin.from("kairos_events").insert(rows);
  } catch {
    // accusé de réception silencieux pour ne rien révéler au site externe
  }

  return new Response(null, { status: 204, headers: corsHeaders });
});
