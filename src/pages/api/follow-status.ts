import type { NextApiRequest, NextApiResponse } from "next";
import { authSupabase, supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // get the user's access token for auth with supabase client
  const authHeader = req.headers.authorization!;

  const { courseId } = req.body;
  const token = authHeader.split(" ")[1];

  const supabaseClient = authSupabase(authHeader);

  const { data: userData, error } = await supabaseClient.auth.getUser(token);

  if (error || !userData) {
    return res.status(401).json({ error: error?.message });
  }
  console.log("userData: ", userData);

  try {
    const { data: followsData, error: followStatusError } = await supabaseClient
      .from("Course_Followers")
      .select("course_id, is_following")
      .eq("user_id", userData.user.id);
    console.log("followsData: ", followsData);

    if (followStatusError) {
      throw followStatusError;
    }

    res.status(200).json({ followStatus: followsData });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
