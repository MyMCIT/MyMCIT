import { supabase } from "../../lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Review } from "@/models/review";

type ErrorMessage = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Review | Review[] | ErrorMessage>,
) {
  if (req.method === "GET") {
    const course_id = req.query.course_id as string;

    if (course_id) {
      const { data: reviews, error } = await supabase
        .from("Reviews")
        .select("*")
        .eq("course_id", course_id);

      if (error) {
        console.error("Error fetching from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      console.log("Reviews fetch successful...");
      return res.status(200).json(reviews || []);
    } else {
      const { data: reviews, error } = await supabase
        .from("Reviews")
        .select("*");

      if (error) {
        console.error("Error fetching from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      console.log("Reviews fetch successful...");
      return res.status(200).json(reviews || []);
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
