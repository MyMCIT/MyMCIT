import { Suspense } from "react";
import EditReviewForm from "@/components/EditReviewForm";
import { getCourses } from "@/lib/data";
import { getCachedSemesters } from "@/lib/semesters";

export const metadata = {
  title: "Edit Review",
};

export default async function EditReviewPage() {
  const courses = await getCourses();
  const sortedCourses = [...courses].sort((a, b) =>
    a.course_code.localeCompare(b.course_code),
  );
  const semesters = await getCachedSemesters();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditReviewForm courses={sortedCourses} semesters={semesters} />
    </Suspense>
  );
}
