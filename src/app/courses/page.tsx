import { Suspense } from "react";
import CoursesGrid from "@/components/CoursesGrid";
import { getCourses } from "@/lib/data";

export const metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <Suspense fallback={<div>Loading courses...</div>}>
      <CoursesGrid courses={courses} />
    </Suspense>
  );
}
