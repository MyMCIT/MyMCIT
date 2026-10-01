import { NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { revalidateCourseData } from "@/lib/revalidate";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    course_id,
    course_code,
    semester,
    difficulty,
    workload,
    rating,
    comment,
  } = body;

  if (
    !course_id ||
    !semester ||
    !difficulty ||
    !workload ||
    !rating ||
    !comment
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const yearExtracted = parseInt(String(semester).split(" ")[1], 10);
  const currentYear = new Date().getFullYear();
  if (yearExtracted < currentYear - 2 || yearExtracted > currentYear) {
    return NextResponse.json(
      { error: "Semester year is out of the valid range." },
      { status: 400 },
    );
  }

  const workloadValue = parseInt(String(workload).match(/\d+/)?.[0] ?? "");
  if (isNaN(workloadValue) || workloadValue <= 0 || workloadValue > 168) {
    return NextResponse.json(
      { error: "Invalid workload value." },
      { status: 400 },
    );
  }

  if (comment.length < 50 || comment.length > 2000) {
    return NextResponse.json(
      { error: "Invalid comment length." },
      { status: 400 },
    );
  }

  const { user, error, supabaseClient } = await getUserFromAuthHeader(
    request.headers.get("authorization"),
  );
  if (!user || !supabaseClient) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { data, error: insertError } = await supabaseClient
    .from("Reviews")
    .insert([
      {
        course_id,
        semester,
        difficulty,
        workload,
        rating,
        comment,
        user_id: user.id,
      },
    ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  revalidateCourseData(course_code);
  return NextResponse.json({ data });
}
