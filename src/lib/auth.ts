import { authSupabase } from "@/lib/supabase";

export function getBearerToken(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  const [, token] = authHeader.split(" ");
  return token ?? null;
}

export async function getUserFromAuthHeader(authHeader: string | null) {
  const token = getBearerToken(authHeader);
  if (!authHeader || !token) {
    return { user: null, error: "No authorization token provided" };
  }

  const supabaseClient = authSupabase(authHeader);
  const { data, error } = await supabaseClient.auth.getUser(token);

  if (error || !data.user) {
    return { user: null, error: error?.message || "User not found" };
  }

  return { user: data.user, error: null, supabaseClient };
}
