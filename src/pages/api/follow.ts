import { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const { data: existingFollows, error: followError } = await supabaseClient
      .from("Course_Followers")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("course_id", courseId);

    if (followError) {
      throw followError;
    }

    if (existingFollows && existingFollows.length > 0) {
      // Toggle the `is_following` property.
      await supabaseClient
        .from("Course_Followers")
        .update({ is_following: !existingFollows[0].is_following })
        .eq("user_id", userData.user.id)
        .eq("course_id", courseId);

      // The line above will toggle the `is_following` column between true and false.
    } else {
      await supabaseClient.from("Course_Followers").insert([
        {
          user_id: userData.user.id,
          course_id: courseId,
          is_following: true,
        },
      ]);
    }

    // Refresh follows data after update.
    const { data: updatedFollows, error: updatedFollowsErr } =
      await supabaseClient
        .from("Course_Followers")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("course_id", courseId);

    if (updatedFollowsErr) {
      throw updatedFollowsErr;
    }

    // Reflect the current `is_following` status.
    const isNowFollowing = updatedFollows![0].is_following;

    res.status(200).json({ isNowFollowing });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
