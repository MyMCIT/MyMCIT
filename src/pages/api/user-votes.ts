import { NextApiRequest, NextApiResponse } from "next";
import { authSupabase } from "@/lib/supabase";

export default async function getUserVotes(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { courseId } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];
  const supabaseClient = authSupabase(authHeader);

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(token);

  if (userError || !userData) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  // query to join ReviewVotes with Reviews to filter by course_id
  const { data: userVotes, error: userVotesError } = await supabaseClient
    .from("ReviewVotes")
    .select("review_id, vote_type, Reviews!inner(course_id)")
    .eq("Reviews.course_id", courseId) // filter using the course_id from the Reviews table
    .eq("user_id", userData.user.id);

  if (userVotesError) {
    return res.status(500).json({ error: userVotesError.message });
  }

  // format the response by extracting review_id and vote_type only if the course_id matches
  const userVotesMap = userVotes.reduce((acc, { review_id, vote_type }) => {
    return { ...acc, [review_id]: vote_type };
  }, {});

  return res.status(200).json({
    message: "User votes fetched successfully",
    userVotes: userVotesMap,
  });
}
