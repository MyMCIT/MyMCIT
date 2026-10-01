import { Suspense } from "react";
import HomeCourseGrid from "@/components/HomeCourseGrid";
import { getCourseSummaries } from "@/lib/data";

export default async function HomePage() {
  const courseSummaries = await getCourseSummaries();
  return (
    <Suspense fallback={<div>Loading courses...</div>}>
      <HomeCourseGrid courseSummaries={courseSummaries} />
    </Suspense>
  );
}
