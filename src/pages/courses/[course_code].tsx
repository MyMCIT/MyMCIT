"use client";

import type { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import {
  Typography,
  Grid,
  Paper,
  Box,
  ChipPropsColorOverrides,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  Button,
} from "@mui/material";
import { GetStaticPaths } from "next";
import { supabase } from "@/lib/supabase";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import Head from "next/head";
import { Course } from "@/models/course";
import { Review } from "@/models/review";
import { OverridableStringUnion } from "@mui/types";
import ReviewCard from "@/components/ReviewCard";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import AddReviewButton from "@/components/AddReviewButton";
import { track } from "@vercel/analytics";

type CourseReviewSummary = {
  id: number;
  course_name: string;
  course_code: string;
  totalReviews: number;
  averageDifficulty: number;
  averageWorkload: number;
  averageRating: number;
  [key: string]: number | string;
};

//  type defs for chip colors
type ChipColor = OverridableStringUnion<
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>;

let apiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://127.0.0.1:3000";

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: courses, error } = await supabase
    .from("Courses")
    .select("course_code");
  if (error) throw error;
  const paths = courses.map((course: { course_code: string }) => ({
    params: { course_code: course.course_code },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ course_code: string }>,
) => {
  try {
    const { course_code } = context.params as { course_code: string };

    // fetch course data
    const resCourse = await axios(
      `${apiUrl}/api/courses?course_code=${course_code}`,
    );

    const courses: Course[] = await resCourse.data;

    // ensure course is found
    const course = courses.length > 0 ? courses[0] : null;
    if (!course) {
      return { notFound: true };
    }

    // fetch course summary
    const resSummary = await axios(
      `${apiUrl}/api/course-summaries?course_code=${course_code}`,
    );

    const courseSummary: CourseReviewSummary[] = await resSummary.data;

    // fetch course reviews
    const resReviews = await axios(
      `${apiUrl}/api/reviews?course_id=${course.id}`,
    );
    let reviews: Review[] = await resReviews.data;

    // sort the reviews by semester and 'created_at'
    reviews = reviews.sort((a, b) => {
      const termMap: { [key in "Spring" | "Summer" | "Fall"]: string } = {
        Spring: "10",
        Summer: "20",
        Fall: "30",
      };

      const parseSemester = (semester: string) => {
        const [term, year] = semester.split(" ");
        // check if term is a valid key in termMap, if not return 0
        return term in termMap
          ? parseInt(year + termMap[term as "Spring" | "Summer" | "Fall"])
          : 0;
      };

      const semesterDiff =
        parseSemester(b.semester) - parseSemester(a.semester);

      if (semesterDiff !== 0) return semesterDiff;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return {
      props: {
        course,
        courseSummary,
        reviews,
      },
      revalidate: 86400,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching courses:", error.message);
    }
    return { notFound: true };
  }
};

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

// color mappings
const difficultyColors: { [key: string]: ChipColor } = {
  "Very Easy": "success",
  Easy: "primary",
  Medium: "default",
  Hard: "warning",
  "Very Hard": "error",
};

const ratingColors: { [key: string]: ChipColor } = {
  "Strongly Disliked": "error",
  Disliked: "warning",
  Neutral: "default",
  Liked: "primary",
  "Strongly Liked": "success",
};

// function to get color based on value
const getDifficultyColor = (value: string) =>
  difficultyColors[value as keyof typeof difficultyColors];
const getRatingColor = (value: string) =>
  ratingColors[value as keyof typeof ratingColors];

// format date for each review's created_at db date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export default function CourseReviews({
  course,
  courseSummary,
  reviews,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // state to manage order of reviews by most recent or by highest user votes
  const [selectedSort, setSelectedSort] = useState("highestVotes");

  // state to manage selected semester(s) filter
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);

  // state to manage the reviews by positive/negative sentiment
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);

  // for storing all the reviews user has already voted on
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // fetch user votes when the course is loaded and the user is authenticated
    const fetchUserVotes = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session.data?.session) {
          const response = await fetch(`${apiUrl}/api/user-votes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.data.session.access_token}`,
            },
            body: JSON.stringify({ courseId: course.id }),
          });
          if (response.ok) {
            const data = await response.json();
            setUserVotes(data.userVotes);
          } else {
            console.error("Failed to fetch user votes");
          }
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    fetchUserVotes();
  }, [course.id]);

  // handles state changes for the sort dropdown
  const handleSortChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedSort(event.target.value);
    // track analytics to see which kind of sort is most popular
    track("sort_reviews", { sort_by: event.target.value.toString() });
  };

  // array to hold all the semesters
  const allSemesters: string[] = [
    ...new Set(reviews.map((review) => review.semester)),
  ];

  // sentiment options
  const sentimentOptions = ["Positive", "Negative", "Neutral"];

  if (!reviews.length) {
    return (
      <Typography variant="h6" align="center" mt={5}>
        No reviews are available for this course.
      </Typography>
    );
  }

  // handles state changes for the semester filter dropdown
  const handleSemesterChange = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setSelectedSemesters(typeof value === "string" ? value.split(",") : value);
  };

  // handles state changes for reviews sentiment
  const handleSentimentChange = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setSelectedSentiments(typeof value === "string" ? value.split(",") : value);
  };

  // clears out all the filters if user clicks on Reset button
  const handleResetFilters = () => {
    setSelectedSort("highestVotes");
    setSelectedSemesters([]);
    setSelectedSentiments([]);
  };

  // determine if any filters are applied by the user
  const isFilterApplied =
    selectedSemesters.length > 0 || selectedSentiments.length > 0;

  // filter displayed reviews based on selected filters(s) in the dropdowns
  const filteredReviews = reviews
    .filter(
      (review: Review) =>
        (selectedSemesters.length === 0 ||
          selectedSemesters.includes(review.semester)) &&
        (selectedSentiments.length === 0 ||
          (selectedSentiments.includes("Positive") &&
            (review.rating === "Liked" ||
              review.rating === "Strongly Liked")) ||
          (selectedSentiments.includes("Negative") &&
            (review.rating === "Disliked" ||
              review.rating === "Strongly Disliked")) ||
          (selectedSentiments.includes("Neutral") &&
            review.rating === "Neutral")),
    )
    .sort((a, b) => {
      if (selectedSort === "highestVotes") {
        // sorts reviews by highest net votes first
        return (b.net_votes ?? 0) - (a.net_votes ?? 0);
      }
      // reverts to default sort by most recent reviews in desc oreder
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  // re-calculate course summary data based on the filtered reviews
  const getSummaryFromReviews = (filteredReviews: any[]) => {
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
      totalReviews,
      averageDifficulty: averageDifficulty.toFixed(2),
      averageWorkload: averageWorkload.toFixed(2),
      averageRating: averageRating.toFixed(2),
    };
  };

  const handleDelete = async (reviewId: number, courseCode: string) => {
    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();

    // confirm deletion with  user
    if (!confirm("Are you sure you want to delete this review?")) return;

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
      alert("Failed to delete review.");
      return;
    }

    setIsSubmitting(false);
    window.location.reload();
  };

  // fetch the course summary for the current course
  const summary =
    courseSummary.find(
      (summary) => summary.course_code === course.course_code,
    ) || null;

  // calculate the summary from filtered reviews or use the default summary (user hasn't filtered anything)
  const currentSummary = isFilterApplied
    ? getSummaryFromReviews(filteredReviews)
    : {
        totalReviews: summary?.totalReviews,
        averageDifficulty: summary?.averageDifficulty.toFixed(2),
        averageWorkload: summary?.averageWorkload.toFixed(2),
        averageRating: summary?.averageRating.toFixed(2),
      };

  const sections = [
    { label: "Total Reviews", key: "totalReviews" },
    { label: "Average Difficulty", key: "averageDifficulty" },
    { label: "Average Workload", key: "averageWorkload" },
    { label: "Average Rating", key: "averageRating" },
  ];

  return (
    <>
      <Head>
        <title>{`${course.course_code}: ${course.course_name}`}</title>
      </Head>

      <Typography variant="h5" align="center" gutterBottom mt={3} mb={3}>
        Reviews for {course.course_code}: {course.course_name}
      </Typography>

      <Paper sx={{ maxWidth: 800, margin: "30px auto", padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle1" color="textSecondary">
                Total Reviews
              </Typography>
              <Typography variant="h6">
                {currentSummary.totalReviews}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle1" color="textSecondary">
                Average Difficulty
              </Typography>
              <Typography variant="h6">
                {currentSummary.averageDifficulty}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="subtitle1" color="textSecondary">
                Average Workload
              </Typography>
              <Typography variant="h6">
                {currentSummary.averageWorkload}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
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
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={selectedSort}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="highestVotes">Highest Vote Score</MenuItem>
                <MenuItem value="mostRecent">Most Recent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}></Grid>
          {/*empty grid so RESET button is*/}
          {/*centered*/}
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button variant="outlined" onClick={handleResetFilters}>
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

      {filteredReviews.map((review, index) => (
        <ReviewCard
          review={review}
          key={review.id}
          course={course}
          userHasVoted={userVotes[review.id]}
        />
      ))}

      <SpeedDialTooltipOpen />
    </>
  );
}
