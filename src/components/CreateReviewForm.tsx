"use client";

import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { courseCodesMatch } from "@/lib/course-code";
import { Course } from "@/models/course";
import { supabase } from "@/lib/supabase";
import { track } from "@vercel/analytics";
import axios from "axios";

export default function CreateReviewForm({
  courses,
  semesters,
}: {
  courses: Course[];
  semesters: string[];
}) {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [workload, setWorkload] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAuthSnackbar, setOpenAuthSnackbar] = useState(false);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const workloadNum = parseInt(workload);
  const workloadError =
    workload && (!/^\d+$/.test(workload) || workloadNum <= 0 || workloadNum > 168)
      ? "Workload must be a positive integer less than or equal to 168"
      : "";
  const reviewError =
    review.length > 0 && (review.length < 50 || review.length > 2000)
      ? "Review must be at least 50 characters and less than or equal to 2000"
      : "";

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        setOpenAuthSnackbar(true);
        router.push("/");
      }
    })();
  }, [router]);

  const isFormValid =
    courseName &&
    semester &&
    difficulty &&
    workload &&
    rating &&
    review &&
    review.length >= 50 &&
    review.length <= 2000 &&
    !workloadError &&
    !reviewError;

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        setIsSubmitting(true);
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          track("Create-Review-Unauthorized-User");
          router.push("/");
          setIsSubmitting(false);
          return;
        }

        const response = await axios("/api/create-review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session?.access_token}`,
          },
          data: JSON.stringify({
            course_id: course?.id,
            course_code: course?.course_code,
            semester,
            difficulty,
            workload: workload + " hrs/wk",
            rating,
            comment: review,
          }),
        });

        setIsSubmitting(false);
        if (response.status !== 200) {
          track("Create-Review-Failed");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        track("Create-Review-Success");
        setOpenSnackbar(true);
        router.push("/");
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
    [],
  );

  const difficultyLevels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  const ratings = [
    "Strongly Disliked",
    "Disliked",
    "Neutral",
    "Liked",
    "Strongly Liked",
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
          p: isXs ? 1 : 2,
        }}
      >
        <Typography variant="h6">Create Review</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              required
              value={courseName}
              onChange={(e) => {
                const selectedCourse = courses.find((item) =>
                  courseCodesMatch(item.course_code, e.target.value),
                );
                if (!selectedCourse) return;
                setCourse(selectedCourse);
                setCourseName(selectedCourse.course_code);
              }}
              label="Course"
            >
              {courses.map((item) => (
                <MenuItem key={item.id} value={item.course_code}>
                  {item.course_code}: {item.course_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              required
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
            <FormHelperText>
              You can only review courses from the last 3 years.
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              required
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
              required
              error={!!workloadError}
              helperText={workloadError}
              type="text"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              label="Workload (hours/week)"
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="rating-label">Rating</InputLabel>
            <Select
              required
              labelId="rating-label"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              label="Rating"
            >
              {ratings.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              required
              error={!!reviewError}
              helperText={reviewError}
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              label="Your Review"
              slotProps={{ htmlInput: { maxLength: 2000 } }}
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
  );
}
