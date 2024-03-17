import { createClient } from "@supabase/supabase-js";

// check if env is prod or dev
const isProduction = process.env.NODE_ENV === "production";

// sync the supabase env vars for whether in prod or dev
const supabaseUrl = isProduction
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL!;

console.log(supabaseUrl);

const supabaseAnonKey = isProduction
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authSupabase = (authHeader: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
};
