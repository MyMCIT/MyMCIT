import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const legacyCourseName = searchParams.get("legacy_course_name");

  try {
    const { data: reviews, error } = await supabase
      .from("Reviews")
      .select("*")
      .eq("legacy_course_name", legacyCourseName)
      .order("legacy_date", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(reviews, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: (error as Error).message },
      { status: 500 },
    );
  }
}
