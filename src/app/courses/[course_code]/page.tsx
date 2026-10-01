import { Suspense } from "react";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/CourseDetail";
import {
  getCourseByCode,
  getCourseCodes,
  getCourseSummaries,
  getReviews,
  sortReviews,
} from "@/lib/data";

export async function generateStaticParams() {
  const courseCodes = await getCourseCodes();
  return courseCodes.map((course_code) => ({ course_code }));
}

function decodeCourseCode(courseCode: string) {
  try {
    return decodeURIComponent(courseCode);
  } catch {
    return courseCode;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course_code: string }>;
}) {
  const { course_code } = await params;
  const course = await getCourseByCode(decodeCourseCode(course_code));
  if (!course) {
    return { title: "Course not found" };
  }
  return { title: `${course.course_code}: ${course.course_name}` };
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ course_code: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading course...</div>}>
      <CoursePageContent params={params} />
    </Suspense>
  );
}

async function CoursePageContent({
  params,
}: {
  params: Promise<{ course_code: string }>;
}) {
  const { course_code: rawCourseCode } = await params;
  const course_code = decodeCourseCode(rawCourseCode);
  const course = await getCourseByCode(course_code);
  if (!course) {
    notFound();
  }

  const [courseSummary, reviews] = await Promise.all([
    getCourseSummaries(),
    getReviews(course.id),
  ]);

  return (
    <CourseDetail
      course={course}
      courseSummary={courseSummary}
      reviews={sortReviews(reviews)}
    />
  );
}
