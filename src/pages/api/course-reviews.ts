'use client'

import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { legacy_course_name } = req.query;

  try {
    const { data: reviews, error } = await supabase
      .from("Reviews")
      .select("*")
      .eq("legacy_course_name", legacy_course_name as string)
      .order("legacy_date", { ascending: false });

    if (error) throw error; // If there's any supabase error, throw it.

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: (error as Error).message });
  }
}
