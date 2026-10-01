import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateCourseData(courseCode?: string) {
  revalidateTag("course-summaries", "max");
  revalidateTag("reviews", "max");
  revalidateTag("courses", "max");
  revalidateTag("reviews-all", "max");
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/reviews");

  if (courseCode) {
    const normalized = courseCode.trim();
    revalidateTag(`course-${normalized.toLowerCase()}`, "max");
    revalidatePath(`/courses/${normalized}`);
    if (normalized !== normalized.toLowerCase()) {
      revalidatePath(`/courses/${normalized.toLowerCase()}`);
    }
  }
}
