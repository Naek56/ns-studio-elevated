import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

// Client navigateur (clé publishable/anon). Sert aux appels Edge Functions
// (via supabase.functions.invoke) et au temps réel de l'onglet Live.
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_KEY || "placeholder-anon-key",
  { auth: { persistSession: false } }
);

export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
