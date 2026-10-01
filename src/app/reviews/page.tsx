import { Suspense } from "react";
import ReviewsList from "@/components/ReviewsList";
import { getReviewsWithCourses } from "@/lib/data";

export const metadata = {
  title: "Reviews",
};

export default async function ReviewsPage() {
  const reviews = await getReviewsWithCourses();
  return (
    <Suspense fallback={<div>Loading reviews...</div>}>
      <ReviewsList reviews={reviews} />
    </Suspense>
  );
}
