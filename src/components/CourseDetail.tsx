"use client";

import {
  Typography,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  Button,
} from "@mui/material";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { Course } from "@/models/course";
import { Review } from "@/models/review";
import { CourseReviewSummary } from "@/models/course-review-summary";
import { courseCodesMatch } from "@/lib/course-code";
import ReviewCard from "@/components/ReviewCard";
import { useState } from "react";
import AddReviewButton from "@/components/AddReviewButton";

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

export default function CourseDetail({
  course,
  courseSummary,
  reviews,
}: {
  course: Course;
  courseSummary: CourseReviewSummary[];
  reviews: Review[];
}) {
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);

  const allSemesters: string[] = [
    ...new Set(reviews.map((review) => review.semester)),
  ];
  const sentimentOptions = ["Positive", "Negative", "Neutral"];

  const handleSemesterChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    setSelectedSemesters(typeof value === "string" ? value.split(",") : (value as string[]));
  };

  const handleSentimentChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    setSelectedSentiments(typeof value === "string" ? value.split(",") : (value as string[]));
  };

  const isFilterApplied =
    selectedSemesters.length > 0 || selectedSentiments.length > 0;

  const filteredReviews = reviews.filter(
    (review: Review) =>
      (selectedSemesters.length === 0 ||
        selectedSemesters.includes(review.semester)) &&
      (selectedSentiments.length === 0 ||
        (selectedSentiments.includes("Positive") &&
          (review.rating === "Liked" || review.rating === "Strongly Liked")) ||
        (selectedSentiments.includes("Negative") &&
          (review.rating === "Disliked" ||
            review.rating === "Strongly Disliked")) ||
        (selectedSentiments.includes("Neutral") &&
          review.rating === "Neutral")),
  );

  const getSummaryFromReviews = (filtered: Review[]) => {
    const totalReviews = filtered.length;
    const averageDifficulty =
      filtered.reduce(
        (acc, curr) =>
          acc +
          (difficultyMap[curr.difficulty as keyof typeof difficultyMap] || 0),
        0,
      ) / totalReviews || 0;
    const averageRating =
      filtered.reduce(
        (acc, curr) =>
          acc + (ratingMap[curr.rating as keyof typeof ratingMap] || 0),
        0,
      ) / totalReviews || 0;
    const averageWorkload =
      filtered.reduce(
        (acc, curr) => acc + parseInt(curr.workload.match(/\d+/)?.[0] || "0"),
        0,
      ) / totalReviews || 0;

    return {
      totalReviews,
      averageDifficulty: averageDifficulty.toFixed(2),
      averageWorkload: averageWorkload.toFixed(2),
      averageRating: averageRating.toFixed(2),
    };
  };

  const summary =
    courseSummary.find(
      (item) => courseCodesMatch(item.course_code, course.course_code),
    ) || null;

  const currentSummary = isFilterApplied
    ? getSummaryFromReviews(filteredReviews)
    : {
        totalReviews: summary?.totalReviews ?? 0,
        averageDifficulty: (summary?.averageDifficulty ?? 0).toFixed(2),
        averageWorkload: (summary?.averageWorkload ?? 0).toFixed(2),
        averageRating: (summary?.averageRating ?? 0).toFixed(2),
      };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Reviews for {course.course_code}: {course.course_name}
      </Typography>

      <Paper sx={{ maxWidth: 800, margin: "30px auto", padding: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="textSecondary">
                Total Reviews
              </Typography>
              <Typography variant="h6">
                {currentSummary.totalReviews}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="textSecondary">
                Average Difficulty
              </Typography>
              <Typography variant="h6">
                {currentSummary.averageDifficulty}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="textSecondary">
                Average Workload
              </Typography>
              <Typography variant="h6">
                {currentSummary.averageWorkload}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="textSecondary">
                Average Rating
              </Typography>
              <Typography variant="h6">
                {currentSummary.averageRating}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
        <Grid container spacing={1} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                multiple
                value={selectedSemesters}
                onChange={handleSemesterChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Semester" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {allSemesters.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="sentiment-select-label">Sentiment</InputLabel>
              <Select
                labelId="sentiment-select-label"
                multiple
                value={selectedSentiments}
                onChange={handleSentimentChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Sentiment" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {sentimentOptions.map((sentiment) => (
                  <MenuItem key={sentiment} value={sentiment}>
                    {sentiment}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 12, md: 4 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedSemesters([]);
                setSelectedSentiments([]);
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
          <AddReviewButton />
        </Box>
      </Box>

      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <ReviewCard review={review} key={review.id} course={course} />
        ))
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
          No reviews are available for this course.
        </Typography>
      )}

      <SpeedDialTooltipOpen />
    </>
  );
}
