"use client";

import { Typography } from "@mui/material";
import ReviewCard from "@/components/ReviewCard";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { Review } from "@/models/review";

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        All Course Reviews
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard review={review} key={review.id} course={review.course} />
        ))
      ) : (
        <Typography align="center">No reviews available.</Typography>
      )}
      <SpeedDialTooltipOpen />
    </>
  );
}
