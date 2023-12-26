import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { fetchCourses } from "../../utils/firebase-db.ts";
import { CourseSummary } from "../../components/CourseSummary";
import { ReviewCard } from "../../components/ReviewCard";

export function Course() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses().then((courses) => {
      setCourses(courses);
    });
  }, []);

  return (
    <Stack alignItems="center">
      <CourseSummary />
      <Box>
        {courses ? (
          courses.map((course, idx) => (
            <ReviewCard course={course} id={idx} key={idx} />
          ))
        ) : (
          <Typography>No Courses Yet</Typography>
        )}
      </Box>
    </Stack>
  );
}
