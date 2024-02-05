import { useEffect, useState } from "react";
import { Review } from "@/models/review";
import { Course } from "@/models/course";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { Typography } from "@mui/material";
import ReviewCard from "@/components/ReviewCard";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { useRouter } from "next/router";
import UserReviewCard from "@/components/UserReviewCard";
import { track } from "@vercel/analytics";

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: Course }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        console.log("No session found");
        return;
      }

      const response = await fetch("/api/user-reviews", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch reviews");
        return;
      }

      const data = await response.json();
      setReviews(data.reviews);
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: number, courseCode: string) => {
    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();

    // confirm deletion with  user
    if (!confirm("Are you sure you want to delete this review?")) return;

    // track deletion event
    track("Delete-Review-Submitted");

    const response = await fetch(`/api/delete-review`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        id: reviewId,
        course_code: courseCode,
      }),
    });

    if (!response.ok) {
      track("Delete-Review-Failed");
      alert("Failed to delete review.");
      return;
    }

    // if delete was successful, remove review from local state
    track("Delete-Review-Success");
    setReviews(reviews.filter((review) => review.id !== reviewId));
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>My Reviews</title>
      </Head>

      <Typography variant="h4" align="center" gutterBottom mt={3} mb={3}>
        My Reviews
      </Typography>

      {reviews.map((review, index) => (
        <UserReviewCard
          key={index}
          review={review}
          course={review.course}
          onEdit={() => router.push(`/reviews/edit-review?id=${review.id}`)}
          onDelete={() => handleDelete(review.id, review.course.course_code)}
        />
      ))}
      <SpeedDialTooltipOpen />
    </>
  );
}
