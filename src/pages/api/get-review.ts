'use client'

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Review ID is required" });
  }

  const { data: review, error } = await supabase
    .from("Reviews")
    .select(
      `
      *, 
      Courses:course_id (
*
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!review) return res.status(404).json({ error: "Review not found" });

  const response = {
    id: review.id,
    course_id: review.course_id,
    created_at: review.created_at,
    semester: review.semester,
    difficulty: review.difficulty,
    workload: review.workload,
    rating: review.rating,
    comment: review.comment,
    course: review.Courses,
  };

  res.status(200).json(response);
}
