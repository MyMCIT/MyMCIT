import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Review ID is required" },
      { status: 400 },
    );
  }

  const { data: review, error } = await supabase
    .from("Reviews")
    .select(
      `
      *,
      Courses:course_id (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: review.id,
    course_id: review.course_id,
    created_at: review.created_at,
    semester: review.semester,
    difficulty: review.difficulty,
    workload: review.workload,
    rating: review.rating,
    comment: review.comment,
    course: review.Courses,
  });
}
