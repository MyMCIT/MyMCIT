import {
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  ChipPropsColorOverrides,
} from "@mui/material";
import {
  BeachAccessOutlined,
  CakeOutlined,
  FunctionsOutlined,
  HikingOutlined,
  RocketLaunchOutlined,
  School,
  SentimentDissatisfiedOutlined,
  SentimentNeutralOutlined,
  SentimentSatisfiedAltOutlined,
  SentimentSatisfiedOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
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

// function to get icon based on difficulty value
const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "Very Easy":
      return <BeachAccessOutlined />;
    case "Easy":
      return <CakeOutlined />;
    case "Medium":
      return <FunctionsOutlined />;
    case "Hard":
      return <HikingOutlined />;
    case "Very Hard":
      return <RocketLaunchOutlined />;
    default:
      return <AccessTimeOutlinedIcon />;
  }
};

// function to get icon based on rating value
const getRatingIcon = (rating: string) => {
  switch (rating) {
    case "Strongly Liked":
      return <SentimentVerySatisfiedOutlined />;
    case "Liked":
      return <SentimentSatisfiedAltOutlined />;
    case "Neutral":
      return <SentimentNeutralOutlined />;
    case "Disliked":
      return <SentimentDissatisfiedOutlined />;
    case "Strongly Disliked":
      return <SentimentVeryDissatisfiedOutlined />;
    default:
      return <AccessTimeOutlinedIcon />;
  }
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
