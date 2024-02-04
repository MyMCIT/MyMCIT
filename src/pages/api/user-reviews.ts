import { authSupabase, supabase } from "@/lib/supabase";

export default async function userReviews(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  const token = authHeader.split(" ")[1];
  const supabaseClient = authSupabase(authHeader);

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(token);
  if (userError || !userData) {
    return res.status(401).json({ error: userError?.message });
  }

  // fetch reviews and include course details in the same query
  // sort to be in descending order by created_at
  const { data: reviews, error: reviewsError } = await supabase
    .from("Reviews")
    .select("*, course:course_id (id, course_name, course_code)")
    .eq("user_id", userData.user?.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    return res.status(500).json({ error: reviewsError.message });
  }

  return res.status(200).json({ reviews });
}
