import { corsHeaders, json } from "../_shared/cors.ts";
import { requireToken } from "../_shared/auth.ts";
import { adminClient } from "../_shared/supabase.ts";
import { summarizeEvents, type RawEvent } from "../_shared/events.ts";
import { runChat, type ClientLike } from "../_shared/anthropic.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!(await requireToken(req))) return json({ error: "Non autorisé" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Requête invalide" }, 400);
  }

  const op = String(body.op || "");
  const clientId = String(body.clientId || "");
  const admin = adminClient();

  try {
    if (op === "history") {
      const { data, error } = await admin
        .from("kairos_messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (error) throw error;
      return json({ messages: data || [] });
    }

    if (op === "send") {
      const userMessage = String(body.message || "").trim();
      if (!userMessage) return json({ error: "Message vide." }, 400);

      const { data: client } = await admin
        .from("kairos_clients")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      if (!client) return json({ error: "Client introuvable" }, 404);

      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const [rapportsRes, eventsRes, historyRes] = await Promise.all([
        admin
          .from("kairos_rapports")
          .select("created_at,score,rapport")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })
          .limit(3),
        admin
          .from("kairos_events")
          .select("session_id,type,page,data")
          .eq("client_id", clientId)
          .gte("created_at", since)
          .limit(5000),
        admin
          .from("kairos_messages")
          .select("role,content")
          .eq("client_id", clientId)
          .order("created_at", { ascending: true })
          .limit(40),
      ]);

      const summary = summarizeEvents((eventsRes.data || []) as RawEvent[], 7);
      const reply = await runChat(
        client as ClientLike,
        rapportsRes.data || [],
        summary,
        (historyRes.data || []) as Array<{ role: "user" | "assistant"; content: string }>,
        userMessage
      );

      await admin.from("kairos_messages").insert([
        { client_id: clientId, role: "user", content: userMessage },
        { client_id: clientId, role: "assistant", content: reply },
      ]);

      return json({ reply });
    }

    return json({ error: "Opération inconnue" }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur serveur" }, 500);
  }
});
