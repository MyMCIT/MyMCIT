import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/models/course";
import type { Review } from "@/models/review";
import type { CourseReviewSummary } from "@/models/course-review-summary";

const difficultyMap = {
  "Very Hard": 5,
  Hard: 4,
  Medium: 3,
  Easy: 2,
  "Very Easy": 1,
};

const ratingMap = {
  "Strongly Liked": 5,
  Liked: 4,
  Neutral: 3,
  Disliked: 2,
  "Strongly Disliked": 1,
};

export async function getCourses(): Promise<Course[]> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag("courses");

  const { data, error } = await supabase.from("Courses").select("*");
  if (error) {
    throw error;
  }
  return (data ?? []) as Course[];
}

export async function getCourseByCode(
  courseCode: string,
): Promise<Course | null> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag("courses", `course-${courseCode}`);

  const { data, error } = await supabase
    .from("Courses")
    .select("*")
    .eq("course_code", courseCode);

  if (error) {
    throw error;
  }
  return ((data?.[0] as Course | undefined) ?? null);
}

export async function getCourseCodes(): Promise<string[]> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag("courses");

  const { data, error } = await supabase.from("Courses").select("course_code");
  if (error) {
    throw error;
  }
  return (data ?? []).map((course: { course_code: string }) => course.course_code);
}

export async function getReviews(courseId?: number): Promise<Review[]> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag(
    "reviews",
    courseId != null ? `reviews-course-${courseId}` : "reviews-all",
  );

  let query = supabase.from("Reviews").select("*");
  if (courseId != null) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return (data ?? []) as Review[];
}

export async function getCourseSummaries(): Promise<CourseReviewSummary[]> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag("course-summaries");

  const [courses, reviews] = await Promise.all([getCourses(), getReviews()]);

  return courses.map((course) => {
    const filteredReviews = reviews.filter(
      (review) => review.course_id === course.id,
    );
    const totalReviews = filteredReviews.length;
    const averageDifficulty =
      filteredReviews.reduce(
        (acc, curr) =>
          acc +
          (difficultyMap[curr.difficulty as keyof typeof difficultyMap] || 0),
        0,
      ) / totalReviews || 0;
    const averageRating =
      filteredReviews.reduce(
        (acc, curr) =>
          acc + (ratingMap[curr.rating as keyof typeof ratingMap] || 0),
        0,
      ) / totalReviews || 0;
    const averageWorkload =
      filteredReviews.reduce(
        (acc, curr) => acc + parseInt(curr.workload.match(/\d+/)?.[0] || "0"),
        0,
      ) / totalReviews || 0;

    return {
      id: course.id,
      course_name: course.course_name,
      course_code: course.course_code,
      totalReviews,
      averageDifficulty: Number(averageDifficulty.toFixed(2)),
      averageWorkload: Number(averageWorkload.toFixed(2)),
      averageRating: Number(averageRating.toFixed(2)),
    };
  });
}

export async function getReviewsWithCourses(): Promise<Review[]> {
  "use cache";
  cacheLife({ revalidate: 86400 });
  cacheTag("reviews", "courses");

  const [reviews, courses] = await Promise.all([getReviews(), getCourses()]);
  const courseMap = courses.reduce(
    (acc, course) => {
      acc[course.id] = course;
      return acc;
    },
    {} as { [key: number]: Course },
  );

  return reviews.map((review) => ({
    ...review,
    course: courseMap[review.course_id],
  }));
}

export function sortReviews(reviews: Review[]): Review[] {
  const termMap: { [key in "Spring" | "Summer" | "Fall"]: string } = {
    Spring: "10",
    Summer: "20",
    Fall: "30",
  };

  const parseSemester = (semester: string) => {
    const [term, year] = semester.split(" ");
    return term in termMap
      ? parseInt(year + termMap[term as "Spring" | "Summer" | "Fall"])
      : 0;
  };

  return [...reviews].sort((a, b) => {
    const semesterDiff = parseSemester(b.semester) - parseSemester(a.semester);
    if (semesterDiff !== 0) {
      return semesterDiff;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
