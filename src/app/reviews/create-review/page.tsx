import { Suspense } from "react";
import CreateReviewForm from "@/components/CreateReviewForm";
import { getCourses } from "@/lib/data";
import { getCachedRecentSemesters } from "@/lib/semesters";

export const metadata = {
  title: "Create Review",
};

export default async function CreateReviewPage() {
  const courses = await getCourses();
  const sortedCourses = [...courses].sort((a, b) =>
    a.course_code.localeCompare(b.course_code),
  );
  const semesters = await getCachedRecentSemesters();
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <CreateReviewForm courses={sortedCourses} semesters={semesters} />
    </Suspense>
  );
}
