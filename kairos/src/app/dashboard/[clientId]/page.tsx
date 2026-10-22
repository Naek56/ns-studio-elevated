import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import ClientWorkspace from "@/components/ClientWorkspace";
import type { KairosClient } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ClientPage({
  params,
}: {
  params: { clientId: string };
}) {
  const admin = createAdminClient();
  const { data: client } = await admin
    .from("kairos_clients")
    .select("*")
    .eq("client_id", params.clientId)
    .maybeSingle<KairosClient>();

  if (!client) notFound();

  return <ClientWorkspace client={client} />;
}
