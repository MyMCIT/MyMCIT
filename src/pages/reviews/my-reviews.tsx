'use client'

import { useEffect, useState } from "react";
import { Review } from "@/models/review";
import { Course } from "@/models/course";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { Alert, Snackbar, Typography } from "@mui/material";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { useRouter } from "next/router";
import UserReviewCard from "@/components/UserReviewCard";
import { track } from "@vercel/analytics";
import axios from "axios";

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: Course }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  useEffect(() => {
    try {
      const fetchReviews = async () => {
        const {data: session} = await supabase.auth.getSession();
        if (!session?.session) {
          console.log("No session found");
          setOpenSnackbar(true);
          // wait  before redirecting to give the user time to read the message
          setTimeout(() => {
            router.push("/");
          }, 5000);

          return;
        }
        const apiUrl =
          process.env.NODE_ENV === "production"
            ? `https://${process.env.NEXT_PUBLIC_API_URL}`
            : "http://127.0.0.1:3000";

        const response = await axios(`${apiUrl}/api/user-reviews`, {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        })

        if (response.status !== 200) {
          console.error("Failed to fetch reviews");
          return;
        }

        const data = await response.data;
        setReviews(data.reviews);
      };

      fetchReviews();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to fetch reviews:", error.message);
      }
    }
  }, [router]);

  const handleCloseSnackbar = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDelete = async (reviewId: number, courseCode: string) => {
    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();

    // confirm deletion with  user
    if (!confirm("Are you sure you want to delete this review?")) return;

    // track deletion event
    track("Delete-Review-Submitted");

    const apiUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://127.0.0.1:3000";

    const response = await axios(`${apiUrl}/api/delete-review`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
      },
      data: JSON.stringify({
        id: reviewId,
        course_code: courseCode,
      }),
    });

    if (response.status !== 200) {
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You are not authenticated! Please log in to view your reviews.
        </Alert>
      </Snackbar>
      <SpeedDialTooltipOpen />
    </>
  );
}
