import { authSupabase, supabase } from "@/lib/supabase";

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
      apiUrl = "http://localhost:3000";
    } // Fetch revalidate API to trigger on-demand ISR
    const response = await fetch(
      `${apiUrl}/api/revalidate?secret=${process.env.ON_DEMAND_ISR_TOKEN}&course=${course_code}`,
    );

    if (!response.ok) {
      return new Error("Error revalidating");
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ data });
}
