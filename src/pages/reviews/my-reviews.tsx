import { useEffect, useState } from "react";
import { Review } from "@/models/review";
import { Course } from "@/models/course";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ReviewCard from "@/components/ReviewCard";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { router } from "next/client";

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: Course }>({});

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

  return (
    <>
      <Head>
        <title>My Reviews</title>
      </Head>

      <Typography variant="h4" align="center" gutterBottom mt={3} mb={3}>
        My Reviews
      </Typography>

      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          review={review}
          course={review.course}
          onEdit={() => router.push(`/reviews/edit-review?id=${review.id}`)}
        />
      ))}
      <SpeedDialTooltipOpen />
    </>
  );
}
