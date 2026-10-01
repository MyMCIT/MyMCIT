"use client";

import { useEffect, useState } from "react";
import { Review } from "@/models/review";
import { supabase } from "@/lib/supabase";
import { Alert, Snackbar, Typography } from "@mui/material";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { useRouter } from "next/navigation";
import UserReviewCard from "@/components/UserReviewCard";
import { track } from "@vercel/analytics";
import axios from "axios";

export default function MyReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push("/");
        }, 5000);
        return;
      }

      const response = await axios.get("/api/user-reviews", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          "Cache-Control": "no-cache",
        },
        params: { _: Date.now() },
      });

      if (response.status !== 200) {
        console.error("Failed to fetch reviews");
        return;
      }
      setReviews(response.data.reviews);
    };

    fetchReviews().catch((error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to fetch reviews:", error.message);
      }
    });
  }, [router]);

  const handleDelete = async (reviewId: number, courseCode: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    track("Delete-Review-Submitted");

    const response = await axios("/api/delete-review", {
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

    track("Delete-Review-Success");
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        My Reviews
      </Typography>
      {reviews.map((review) => (
        <UserReviewCard
          key={review.id}
          review={review}
          course={review.course}
          onEdit={() => router.push(`/reviews/edit-review?id=${review.id}`)}
          onDelete={() => handleDelete(review.id, review.course.course_code)}
        />
      ))}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") {
            setOpenSnackbar(false);
          }
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You are not authenticated! Please log in to view your reviews.
        </Alert>
      </Snackbar>
      <SpeedDialTooltipOpen />
    </>
  );
}
