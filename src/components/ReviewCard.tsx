import { Chip, Typography, Box, Card, CardContent } from "@mui/material";
import { School } from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { getDifficultyColor, getRatingColor } from "@/lib/reviewColorUtils";
import { getDifficultyIcon, getRatingIcon } from "@/lib/reviewIconUtils";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";

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

// format date for each review's created_at db date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export default function ReviewCard({ review, course }: any) {
  const difficultyColor = getDifficultyColor(review.difficulty);
  const ratingColor = getRatingColor(review.rating);

  return (
    <Card
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 2,
        p: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <School sx={{ fontSize: 40, mr: 2 }} />
          <Box flexGrow={1}>
            <Typography
              variant="body1"
              component="div"
              sx={{ fontWeight: "bold", wordWrap: "break-word" }}
            >
              {course.course_code}: {course.course_name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {formatDate(review.created_at)}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body1"
          color="text.primary"
          gutterBottom
          sx={{ wordWrap: "break-word" }}
        >
          {review.comment}
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="right" mt={2}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip
              icon={<ClassOutlinedIcon />}
              label={review.semester}
              sx={{
                m: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                height: { xs: "24px", sm: "32px", md: "36px" },
              }}
            />
            <Chip
              icon={getDifficultyIcon(review.difficulty)}
              label={`Difficulty: ${review.difficulty}`}
              color={difficultyColor}
              variant="outlined"
              sx={{
                m: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                height: { xs: "24px", sm: "32px", md: "36px" },
              }}
            />
            <Chip
              icon={getRatingIcon(review.rating)}
              label={`Rating: ${review.rating}`}
              color={ratingColor}
              variant="outlined"
              sx={{
                m: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                height: { xs: "24px", sm: "32px", md: "36px" },
              }}
            />
            <Chip
              icon={<AccessTimeOutlinedIcon />}
              label={`${review.workload}`}
              sx={{
                m: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                height: { xs: "24px", sm: "32px", md: "36px" },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
