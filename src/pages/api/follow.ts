import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user, courseId } = req.body;

  try {
    // using the course_id from instead of course_code
    const { data: existingFollows, error: followError } = await supabase
      .from("Course_Followers")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (followError) {
      throw followError;
    }

    if (existingFollows?.length > 0) {
      await supabase
        .from("Course_Followers")
        .delete()
        .eq("id", existingFollows[0].id);
    } else {
      await supabase.from("Course_Followers").insert([
        {
          user_id: user.id,
          course_id: courseId,
        },
      ]);
    }

    const isNowFollowing = !(existingFollows?.length > 0);

    res.status(200).json({ isNowFollowing });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
