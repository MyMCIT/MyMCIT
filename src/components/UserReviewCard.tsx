import {
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  ChipPropsColorOverrides,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert, School } from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import React, { useEffect, useState } from "react";
import { isCurrentUserReview } from "@/lib/userUtils";

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

export default function UserReviewCard({
  review,
  course,
  onEdit,
  onDelete,
}: any) {
  const difficultyColor = getDifficultyColor(review.difficulty);
  const ratingColor = getRatingColor(review.rating);
  const [canEditDelete, setCanEditDelete] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await isCurrentUserReview(review);
      setCanEditDelete(hasPermission);
    };

    checkPermission();
  }, [review]);

  // state for dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // handlers for dropdown menu actions (edit, delete)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  // close dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 2,
        p: 2,
        boxShadow: 3,
        position: "relative",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
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

          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                onEdit();
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
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
              label={`Difficulty: ${review.difficulty}`}
              color={difficultyColor}
              sx={{ m: 0.5 }}
            />
            <Chip
              label={`Rating: ${review.rating}`}
              color={ratingColor}
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
