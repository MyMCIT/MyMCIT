import { Chip, Stack } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
  mapColorToDifficulty,
  mapColorToRating,
} from "../../utils/mapColorsToLabels";

interface ReviewCardProps {
  course: {
    courseName: string;
    date: string;
    comment: string;
    semester: string;
    difficulty: string;
    rating: string;
    workload: string;
  };
  id: number;
}

export function ReviewCard({ course, id }: ReviewCardProps) {
  return (
    <Stack
      padding={5}
      width="100%"
      maxWidth={950}
      height="fit-content"
      borderRadius="8px"
      marginTop={3}
      marginBottom={3}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "primary.main",
        boxShadow: "2.5px 2.5px 5px 2.5px #D3D3D3",
      }}
      data-testid={`review-card-${id}`}
    >
      <Stack direction="row">
        <Stack direction="column" justifyContent="start" alignItems="center">
          <RateReviewIcon />
        </Stack>
        <Stack justifyContent="center" alignItems="center" width="100%">
          <h3 style={{ marginTop: 0, marginBottom: 0 }}>{course.courseName}</h3>
          <h4 style={{ marginTop: 0, marginBottom: 0 }}>{course.date}</h4>
        </Stack>
      </Stack>
      <Stack>
        <p style={{ textAlign: "left" }}>{course.comment}</p>
      </Stack>
      <Stack
        direction="row"
        sx={{ width: "100%" }}
        justifyContent="space-between"
      >
        <Chip
          label={course.semester}
          variant="outlined"
          sx={{ color: "rgba(0, 0, 0, 0.87)", width: "fit-content" }}
        />
        <Stack direction="row" gap={1}>
          <Chip
            label={course.difficulty}
            variant="outlined"
            sx={{
              color: mapColorToDifficulty(course.difficulty),
              border: `1px solid ${mapColorToDifficulty(course.difficulty)}`,
            }}
          />
          <Chip
            label={course.rating}
            variant="outlined"
            sx={{
              color: mapColorToRating(course.rating),
              border: `1px solid ${mapColorToRating(course.rating)}`,
            }}
          />
          <Chip label={course.workload} variant="outlined" />
        </Stack>
      </Stack>
    </Stack>
  );
}
