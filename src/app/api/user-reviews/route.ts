import { NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { user, error } = await getUserFromAuthHeader(
    request.headers.get("authorization"),
  );
  if (!user) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("Reviews")
    .select("*, course:course_id (id, course_name, course_code)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  return NextResponse.json({ reviews });
}
