import { NextApiRequest, NextApiResponse } from "next";
import { authSupabase } from "@/lib/supabase";

export default async function handleVote(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // pull the reviewId and voteType (thumbs up = true; thumbs down = false) from the request body
  const { reviewId, voteType } = req.body;
  // authenticate the user with supabase
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];
  const supabaseClient = authSupabase(authHeader);

  // fetch the user
  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(token);

  if (userError || !userData.user) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  // check if the user has already voted; users can only vote once per review
  const { data: existingVote, error: existingVoteError } = await supabaseClient
    .from("ReviewVotes")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("review_id", reviewId)
    .single();

  // error handling for vote checking
  if (existingVoteError && !existingVoteError.message.includes("No rows")) {
    console.error(existingVoteError);
    return res.status(500).json({ error: "Failed to check existing votes" });
  }

  // if user has already voted on review, return 405 status code and error message
  if (existingVote) {
    return res
      .status(409)
      .json({ error: "You have already voted on this review" });
  }

  // otherwise, insert new vote
  const { error: insertError } = await supabaseClient
    .from("ReviewVotes")
    .insert([
      {
        review_id: reviewId,
        user_id: userData.user.id,
        vote_type: voteType,
      },
    ]);

  if (insertError) {
    console.error(insertError);
    return res.status(500).json({ error: insertError.message });
  }

  // don't use on-demand ISR; real-time updates are better for voting
  return res.status(200).json({ message: "Vote recorded successfully" });
}
