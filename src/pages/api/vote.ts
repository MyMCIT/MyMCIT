import { NextApiRequest, NextApiResponse } from "next";
import { authSupabase } from "@/lib/supabase";

// interface for review data type safety check
interface ReviewData {
  positive_votes: number;
  negative_votes: number;
}

export default async function handleVote(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // get reviewId and voteType (thumbs up = true; thumbs down = false) from request body
  const { reviewId, voteType } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];
  const supabaseClient = authSupabase(authHeader);

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(token);

  if (userError || !userData.user) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  // check if user has already voted on this review
  const { data: existingVote, error: existingVoteError } = await supabaseClient
    .from("ReviewVotes")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("review_id", reviewId)
    .single();

  if (existingVoteError && !existingVoteError.message.includes("No rows")) {
    return res.status(500).json({ error: "Failed to check existing votes" });
  }

  if (existingVote) {
    return res
      .status(409)
      .json({ error: "You have already voted on this review" });
  }

  // determine which field to increment based on voteType
  const voteIncrementField = voteType ? "positive_votes" : "negative_votes";
  // Fetch current vote count
  const { data, error: reviewFetchError } = await supabaseClient
    .from("Reviews")
    .select(voteIncrementField)
    .eq("id", reviewId)
    .single();

  if (reviewFetchError) {
    console.error(reviewFetchError);
    return res.status(500).json({ error: "Failed to fetch review data" });
  }

  // cast to ReviewData type for type safety
  const reviewData = data as ReviewData;

  // Increment the vote count
  const newVoteCount =
    (reviewData[voteType ? "positive_votes" : "negative_votes"] || 0) + 1;

  // Insert the new vote
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

  // Update review vote counts
  const { error: updateError } = await supabaseClient
    .from("Reviews")
    .update({
      [voteIncrementField]: newVoteCount,
    })
    .eq("id", reviewId);

  if (updateError) {
    console.error(updateError);
    return res.status(500).json({ error: "Failed to update review votes" });
  }

  return res.status(200).json({ message: "Vote recorded successfully" });
}
