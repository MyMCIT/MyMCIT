"use client";

import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { getSemesters } from "@/lib/semesters";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Course } from "@/models/course";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { track } from "@vercel/analytics";
import axios from "axios";

export const getStaticProps: GetStaticProps = async () => {
  try {
    let apiUrl;

    if (process.env.NODE_ENV === "production") {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
    } else {
      apiUrl = "http://127.0.0.1:3000";
    }
    const res = await axios(`${apiUrl}/api/courses`);
    const courses = await res.data;

    // sort the courses in alphabetical order
    const sortedCourses: Course[] = courses.sort(
      (a: { course_code: string }, b: { course_code: string }) =>
        a.course_code.localeCompare(b.course_code),
    );

    return {
      props: {
        courses: sortedCourses,
      },
      revalidate: 86400,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching courses:", error.message);
    }
    return {
      props: {
        courses: [],
      },
    };
  }
};

export default function CreateReview({ courses }: any) {
  const router = useRouter();
  const [courseName, setCourseName] = useState<string>("");
  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [workload, setWorkload] = useState<string>("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAuthSnackbar, setOpenAuthSnackbar] = useState(false);

  // validation error message states
  const [workloadError, setWorkloadError] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        setOpenAuthSnackbar(true);
        router.push("/");
      }
    })();

    setWorkloadError("");
    setReviewError("");

    if (workload) {
      const workloadNum = parseInt(workload);
      if (!/^\d+$/.test(workload) || workloadNum <= 0 || workloadNum > 168) {
        setWorkloadError(
          "Workload must be a positive integer less than or equal to 168",
        );
      }
    }

    if (review.length > 0 && (review.length < 50 || review.length > 2000)) {
      setReviewError(
        "Review must be at least 50 characters and less than 2000",
      );
    }
  }, [router, workload, review]);

  const isFormValid =
    !workloadError &&
    !reviewError &&
    workload &&
    review.length >= 50 &&
    review.length <= 2000;

  // submits review
  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      try {
        setIsSubmitting(true);

        const { data: sessionData } = await supabase.auth.getSession();

        // check if there's an active session
        if (!sessionData?.session) {
          track("Create-Review-Unauthorized-User");
          router.push("/"); // redirect to "/" if no active session
          setIsSubmitting(false);
          return;
        }

        let apiUrl;

        if (process.env.NODE_ENV === "production") {
          apiUrl = process.env.NEXT_PUBLIC_API_URL;
        } else {
          apiUrl = "http://127.0.0.1:3000";
        }

        const response = await axios(`${apiUrl}/api/create-review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session?.access_token}`,
          },
          data: JSON.stringify({
            course_id: course?.id,
            course_code: course?.course_code,
            semester: semester,
            difficulty: difficulty,
            workload: workload + " hrs/wk",
            rating: rating,
            comment: review,
          }),
        });

        setIsSubmitting(false);
        const data = await response.data;

        if (response.status !== 200) {
          track("Create-Review-Failed");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        track("Create-Review-Success");

        setOpenSnackbar(true);
        await router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error submitting review:", error.message);
        }
      }
    },
    [course, difficulty, rating, review, router, semester, workload],
  );

  const handleCloseSnackbar = useCallback(
    (event?: SyntheticEvent<Element, Event> | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpenSnackbar(false);
    },
    [setOpenSnackbar],
  );

  const difficultyLevels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  const ratings = [
    "Strongly Disliked",
    "Disliked",
    "Neutral",
    "Liked",
    "Strongly Liked",
  ];
  const semesters = getSemesters();

  return (
    <>
      <div>
        <Head>
          <title>Create Review</title>
        </Head>
      </div>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="h6">Create Review</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                value={courseName}
                onChange={(e) => {
                  const selectedCourse: Course = courses.find(
                    (c: { course_code: string | undefined }) =>
                      c.course_code === e.target.value,
                  );
                  setCourse(selectedCourse);
                  setCourseName(selectedCourse.course_code);
                }}
                label="Course"
              >
                {courses.map((course: any) => (
                  <MenuItem key={course.id} value={course.course_code}>
                    {course.course_code}: {course.course_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                label="Semester"
              >
                {semesters.map((season, i) => (
                  <MenuItem key={i} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                {difficultyLevels.map((level, i) => (
                  <MenuItem key={i} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <TextField
                error={!!workloadError}
                helperText={workloadError}
                type="text"
                value={workload.toString()}
                onChange={(e) => setWorkload(e.target.value)}
                label="Workload (hours/week)"
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="rating-label">Rating</InputLabel>
              <Select
                labelId="rating-label"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                label="Rating"
              >
                {ratings.map((rating, i) => (
                  <MenuItem key={i} value={rating}>
                    {rating}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <TextField
                error={!!reviewError}
                helperText={reviewError}
                multiline
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                label="Your Review"
                inputProps={{ maxLength: 2000 }}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={handleCloseSnackbar}
          >
            Successfully submitted new review!
          </Alert>
        </Snackbar>
        <Snackbar
          open={openAuthSnackbar}
          autoHideDuration={9000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={handleCloseSnackbar}
          >
            You are not authenticated!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
