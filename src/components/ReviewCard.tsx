import { Chip, Typography, Box, Card, CardContent } from "@mui/material";
import { School } from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { getDifficultyColor, getRatingColor } from "@/lib/reviewColorUtils";
import { getDifficultyIcon, getRatingIcon } from "@/lib/reviewIconUtils";

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
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <School sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography
              variant="body1"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {course.course_code}: {course.course_name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {formatDate(review.created_at)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" color="text.primary" gutterBottom>
          {review.comment}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          mt={2}
        >
          <Box>
            <Chip
              icon={<ClassOutlinedIcon />}
              label={review.semester}
              sx={{ m: 0.5 }}
            />
          </Box>
          <Box flexGrow={1} display="flex" justifyContent="flex-end">
            <Chip
              icon={getDifficultyIcon(review.difficulty)}
              label={`Difficulty: ${review.difficulty}`}
              color={difficultyColor}
              variant="outlined"
              sx={{ m: 0.5 }}
            />
            <Chip
              icon={getRatingIcon(review.rating)}
              label={`Rating: ${review.rating}`}
              color={ratingColor}
              variant="outlined"
              sx={{ m: 0.5 }}
            />
            <Chip
              icon={<AccessTimeOutlinedIcon />}
              label={`${review.workload}`}
              sx={{ m: 0.5 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
