import { Stack } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";

interface ReviewCardProps {
  course: {
    courseName: string;
    date: string;
    comment: string;
  };
}

export function ReviewCard({ course }: ReviewCardProps) {
  // const theme = useTheme();

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
    >
      <RateReviewIcon />
      <h3>{course.courseName}</h3>
      <h4>{course.date}</h4>
      <p>{course.comment}</p>
    </Stack>
  );
}
