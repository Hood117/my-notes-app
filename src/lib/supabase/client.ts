import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
// Automatically strip "/rest/v1/" suffix if present to prevent auth endpoint resolution collapse
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/rest\/v1/, "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Lazy initialization representing a clean singleton pattern
let supabaseClientInstance: any = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClientInstance;
}

export const supabase = getSupabaseClient();
