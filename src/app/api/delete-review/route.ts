import { NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { revalidateCourseData } from "@/lib/revalidate";

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id, course_code } = body;

  const { user, error, supabaseClient } = await getUserFromAuthHeader(
    request.headers.get("authorization"),
  );
  if (!user || !supabaseClient) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { data, error: deleteError } = await supabaseClient
    .from("Reviews")
    .delete()
    .match({ id, user_id: user.id });

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  revalidateCourseData(course_code);
  return NextResponse.json({
    message: "Review successfully deleted",
    data,
  });
}
