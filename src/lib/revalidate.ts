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
    revalidateTag(`course-${courseCode}`, "max");
    revalidatePath(`/courses/${courseCode}`);
  }
}
