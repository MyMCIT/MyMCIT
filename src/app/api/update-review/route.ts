import { NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { revalidateCourseData } from "@/lib/revalidate";

export async function PUT(request: Request) {
  const body = await request.json();
  const {
    id,
    course_id,
    course_code,
    semester,
    difficulty,
    workload,
    rating,
    comment,
  } = body;

  const { user, error, supabaseClient } = await getUserFromAuthHeader(
    request.headers.get("authorization"),
  );
  if (!user || !supabaseClient) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { data, error: updateError } = await supabaseClient
    .from("Reviews")
    .update({
      course_id,
      semester,
      difficulty,
      workload,
      rating,
      comment,
      user_id: user.id,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  revalidateCourseData(course_code);
  return NextResponse.json({ data });
}
