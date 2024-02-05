import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { GetStaticProps } from "next";
import { Course } from "@/models/course";
import { Review } from "@/models/review";
import { track } from "@vercel/analytics";

export const getStaticProps: GetStaticProps = async () => {
  let apiUrl;

  if (process.env.NODE_ENV === "production") {
    apiUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    apiUrl = "http://localhost:3000";
  }
  const res = await fetch(`${apiUrl}/api/courses`);
  const courses = await res.json();

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
};

export default function EditReview({ courses }: any) {
  const router = useRouter();
  const { id } = router.query;
  const [courseName, setCourseName] = useState<string>("");
  const [course, setCourse] = useState<Course>();
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [workload, setWorkload] = useState<string>("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");

  // pre-fill the form with the review data fetched from API
  useEffect(() => {
    if (id) {
      fetch(`/api/get-review?id=${id}`)
        .then((res) => res.json())
        .then((data: Review) => {
          setCourse(data.course);
          setCourseId(data.course.id.toString());
          setCourseName(data.course.course_name);
          setSemester(data.semester);
          setDifficulty(data.difficulty);
          setWorkload(data.workload.replace(" hrs/wk", ""));
          setRating(data.rating);
          setComment(data.comment);
        })
        .catch((error) => setError("Failed to fetch review"));
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();

    // check if there's an active session
    if (!sessionData?.session) {
      track("Update-Review-Unauthorized-User");
      router.push("/"); // redirect to "/" if no active session
      setIsSubmitting(false);
      return;
    }

    // analytics capture the API call
    track("Update-Review-Submitted");

    const response = await fetch("/api/update-review", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        id: +id!,
        course_id: course?.id,
        course_code: course?.course_code,
        semester: semester,
        difficulty: difficulty,
        workload: workload + " hrs/wk",
        rating: rating,
        comment: comment,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      track("Update-Review-Success");
      setOpenSnackbar(true);
      setTimeout(() => router.push("/reviews/my-reviews"), 2000);
    } else {
      track("Update-Review-Failed");
      setError("Failed to update review");
    }
  };

  if (error) return <div>{error}</div>;

  const semesters = getSemesters();
  const difficultyLevels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  const ratings = [
    "Strongly Disliked",
    "Disliked",
    "Neutral",
    "Liked",
    "Strongly Liked",
  ];

  return (
    <>
      <Head>
        <title>Edit Review</title>
      </Head>
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
                  const selectedCourse: Course = courses.find(
                    (c: { course_code: string | undefined }) =>
                      c.course_code === e.target.value,
                  );
                  setCourse(selectedCourse);
                  setCourseName(selectedCourse.course_code);
                }}
                label="Course"
              >
                {courses.map((course: Course) => (
                  <MenuItem key={course.id} value={course.id}>
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
                type="number"
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
    </>
  );
}
