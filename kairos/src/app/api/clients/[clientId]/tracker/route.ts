import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/guard";
import { buildTracker } from "@/lib/tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { clientId: string } };

// GET /api/clients/[clientId]/tracker — sert kairos-tracker.js (téléchargement)
export async function GET(req: Request, { params }: Params) {
  const denied = await requireAuth();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data: client } = await admin
    .from("kairos_clients")
    .select("client_id")
    .eq("client_id", params.clientId)
    .maybeSingle();

  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const script = buildTracker(params.clientId, origin);

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kairos-tracker.js"',
      "Cache-Control": "no-store",
    },
  });
}
