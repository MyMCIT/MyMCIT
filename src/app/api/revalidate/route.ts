import { NextResponse } from "next/server";
import { revalidateCourseData } from "@/lib/revalidate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const course = searchParams.get("course") ?? undefined;

  if (!process.env.ON_DEMAND_ISR_TOKEN || secret !== process.env.ON_DEMAND_ISR_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  revalidateCourseData(course);
  return NextResponse.json({
    revalidated: true,
    course: course ?? null,
  });
}
