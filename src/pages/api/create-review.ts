"use client";

import { authSupabase } from "@/lib/supabase";
import axios from "axios";

export default async function createReview(req: any, res: any) {
  // parse course_id to string
  const {
    course_id,
    course_code,
    semester,
    difficulty,
    workload,
    rating,
    comment,
  } = req.body;

  // backend validation checks
  if (
    !course_id ||
    !semester ||
    !difficulty ||
    !workload ||
    !rating ||
    !comment
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // take the year from the semester and validate it
  const yearExtracted = parseInt(semester.split(" ")[1], 10);
  const currentYear = new Date().getFullYear();

  // check if the semester year falls within the last three years
  if (yearExtracted < currentYear - 2 || yearExtracted > currentYear) {
    return res
      .status(400)
      .json({ error: "Semester year is out of the valid range." });
  }

  // workload format validation check, remember "hrs/wk" gets appended to it in the API request, so need to account for that
  // by extracting the number from the value, not the "hrs/wk" part
  const workloadValue = parseInt(workload.match(/\d+/)?.[0] ?? "");
  if (isNaN(workloadValue) || workloadValue <= 0 || workloadValue > 168) {
    return res.status(400).json({ error: "Invalid workload value." });
  }

  // review length validation check
  if (comment.length < 50 || comment.length > 2000) {
    return res.status(400).json({ error: "Invalid comment length." });
  }

  // get the user's access token for auth with supabase client
  const authHeader = req.headers.authorization;

  console.log("Req body: ", req.body);
  const token = req.headers.authorization.split(" ")[1];

  // get a new instance of supabase client for the request
  const supabaseClient = authSupabase(authHeader);

  // fetch the user :)
  const { data: userData, error } = await supabaseClient.auth.getUser(token);

  console.log("User: ", userData.user);

  if (error || !userData) {
    return res.status(401).json({ error: error?.message });
  }

  const { data, error: insertError } = await supabaseClient
    .from("Reviews")
    .insert([
      {
        course_id: course_id,
        semester: semester,
        difficulty: difficulty,
        workload: workload,
        rating: rating,
        comment: comment,
        user_id: userData.user?.id,
      },
    ]);

  if (insertError) {
    console.log(data);
    console.log(insertError);
    return res.status(500).json({ error: insertError.message });
  }

  try {
    let apiUrl;

    if (process.env.NODE_ENV === "production") {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
    } else {
      apiUrl = "http://127.0.0.1:3000";
    } // Fetch revalidate API to trigger on-demand ISR
    const response = await axios(
      `${apiUrl}/api/revalidate?secret=${process.env.ON_DEMAND_ISR_TOKEN}&course=${course_code}`,
    );

    if (response.status !== 200) {
      return new Error("Error revalidating");
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ data });
}
