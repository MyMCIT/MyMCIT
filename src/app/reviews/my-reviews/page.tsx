import { Suspense } from "react";
import MyReviewsList from "@/components/MyReviewsList";

export const metadata = {
  title: "My Reviews",
};

export default function MyReviewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyReviewsList />
    </Suspense>
  );
}
