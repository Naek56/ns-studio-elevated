// ════════════════════════════════════════════════════════════════════
//  KAIROS — ingestion publique (autonome). Appelée par kairos-tracker.js
//  depuis les sites des clients. À déployer SANS vérification de JWT.
// ════════════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response(null, { status: 405, headers: corsHeaders });

  let body: { client_id?: string; session_id?: string; events?: Array<Record<string, unknown>> };
  try {
    const raw = await req.text(); // text/plain pour éviter le preflight CORS
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "Corps invalide" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const clientId = body.client_id;
  const events = Array.isArray(body.events) ? body.events : [];
  if (!clientId || events.length === 0) {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

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
    // accusé de réception silencieux
  }

  return new Response(null, { status: 204, headers: corsHeaders });
});
