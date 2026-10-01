"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
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
import { supabase } from "@/lib/supabase";
import { Course } from "@/models/course";
import { Review } from "@/models/review";
import { track } from "@vercel/analytics";
import axios from "axios";

export default function EditReviewForm({
  courses,
  semesters,
}: {
  courses: Course[];
  semesters: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [course, setCourse] = useState<Course>();
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [workload, setWorkload] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    axios(`/api/get-review?id=${id}`)
      .then((res) => res.data)
      .then((data: Review) => {
        setCourse(data.course);
        setCourseId(data.course.id.toString());
        setSemester(data.semester);
        setDifficulty(data.difficulty);
        setWorkload(data.workload.replace(" hrs/wk", ""));
        setRating(data.rating);
        setComment(data.comment);
      })
      .catch(() => setError("Failed to fetch review"));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      track("Update-Review-Unauthorized-User");
      router.push("/");
      setIsSubmitting(false);
      return;
    }

    track("Update-Review-Submitted");
    const response = await axios("/api/update-review", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
      },
      data: JSON.stringify({
        id: Number(id),
        course_id: course?.id,
        course_code: course?.course_code,
        semester,
        difficulty,
        workload: workload + " hrs/wk",
        rating,
        comment,
      }),
    });

    setIsSubmitting(false);
    if (response.status === 200) {
      track("Update-Review-Success");
      setOpenSnackbar(true);
      setTimeout(() => router.push("/reviews/my-reviews"), 2000);
    } else {
      track("Update-Review-Failed");
      setError("Failed to update review");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Review
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              value={courseId}
              onChange={(e) => {
                const selectedCourse = courses.find(
                  (item) => String(item.id) === String(e.target.value),
                );
                if (!selectedCourse) return;
                setCourse(selectedCourse);
                setCourseId(String(selectedCourse.id));
              }}
              label="Course"
            >
              {courses.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.course_code}: {item.course_name}
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
              type="number"
              value={workload}
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
              {ratings.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              label="Your Review"
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Update Review"}
          </Button>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Review updated successfully"
      />
    </Container>
  );
}
