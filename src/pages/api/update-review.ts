'use client'

import { NextApiRequest, NextApiResponse } from "next";
import { authSupabase } from "@/lib/supabase";
import { Review } from "@/models/review";
import { Simulate } from "react-dom/test-utils";
import select = Simulate.select;
import axios from "axios";

export default async function updateReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Update attempt not allowed" });
  }

  const {
    id,
    course_id,
    course_code,
    semester,
    difficulty,
    workload,
    rating,
    comment,
  } = req.body;

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

  const { data, error: updateError } = await supabaseClient
    .from("Reviews")
    .update({
      course_id: course_id,
      semester: semester,
      difficulty: difficulty,
      workload: workload,
      rating: rating,
      comment: comment,
      user_id: userData.user?.id,
    })
    .eq("id", id); // match via review id

  // console log the update
  console.log("Review updated: ", data);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  try {
    let apiUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_API_URL}`
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

  return res.status(200).json({ data });
}
