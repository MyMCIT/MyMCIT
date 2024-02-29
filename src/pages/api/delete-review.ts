'use client'

import { NextApiRequest, NextApiResponse } from "next";
import { authSupabase } from "@/lib/supabase";
import axios from "axios";

export default async function deleteReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Delete attempt not allowed" });
  }

  const { id, course_code } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  const supabaseClient = authSupabase(authHeader);

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser(token);

  if (userError || !userData) {
    return res
      .status(401)
      .json({ error: userError?.message || "User not found" });
  }

  // Execute the deletion
  const { data, error: deleteError } = await supabaseClient
    .from("Reviews")
    .delete()
    .match({ id: id, user_id: userData.user?.id }); // Ensure the user deleting the review owns it

  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  console.log("Review deleted: ", data);

  try {
    let apiUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://127.0.0.1:3000";

    // trigger on-demand ISR with course_code for revalidation
    const response = await axios(
      `${apiUrl}/api/revalidate?secret=${process.env.ON_DEMAND_ISR_TOKEN}&course=${course_code}`,
    );
    if (response.status !== 200) {
      throw new Error("Error revalidating");
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ message: "Review successfully deleted", data });
}
