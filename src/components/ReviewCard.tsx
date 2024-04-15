import {
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from "@mui/material";
import { School, ThumbDown, ThumbUp } from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { getDifficultyColor, getRatingColor } from "@/lib/reviewColorUtils";
import { getDifficultyIcon, getRatingIcon } from "@/lib/reviewIconUtils";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { track } from "@vercel/analytics";

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

export default function ReviewCard({ review, course, userHasVoted }: any) {
  const theme = useTheme();
  // state for handling reviews
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userVote, setUserVote] = useState(userHasVoted);
  const [netVotes, setNetVotes] = useState(review.net_votes || 0);

  // check if user logged in
  const userCheck = async () => {
    try {
      // retrieve current user session from supabase
      const { data: session } = await supabase.auth.getSession();

      // if there's a logged-in user, route them to the create review page, else send them to the login page
      if (session.session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e: any) {
      console.log(e);
      throw new Error(e);
    }
  };

  // set up useEffect to check if user is logged in, with dependency on if user logged in state has changed
  useEffect(() => {
    userCheck();
    setUserVote(userHasVoted);
  }, [isLoggedIn, userHasVoted]);

  const difficultyColor = getDifficultyColor(review.difficulty);
  const ratingColor = getRatingColor(review.rating);

  const handleVote = async (type: "up" | "down") => {
    if (userVote != undefined || !isLoggedIn) {
      return; // prevent voting if already voted or not logged in
    }

    // convert type to boolean where 'up' is true and 'down' is false
    // bc this is how it's stored on Reviews table in db
    const voteType = type === "up";

    try {
      let apiUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://127.0.0.1:3000";

      const { data: session } = await supabase.auth.getSession();

      const response = await fetch(`${apiUrl}/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({
          reviewId: review.id,
          voteType: voteType, // true for 'up', false for 'down'
        }),
      });

      if (response.status === 200) {
        setUserVote(voteType);
        // capture analytics
        track("UserVoted", {
          voteType: voteType ? "up" : "down",
          reviewId: review.id,
          courseId: course.id,
          courseCode: course.course_code,
          courseName: course.course_name,
        });
        const voteIncrement = voteType ? 1 : -1;
        setNetVotes((prev: number) => prev + voteIncrement);
      } else {
        const result = await response.json();
        console.error("Failed to record vote:", result.error);
      }
    } catch (error: any) {
      console.error(
        "Error voting:",
        error.response?.data?.error || error.message,
      );
    }
  };

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
        <Box
          sx={{
            mt: 2,
            p: 1,
            backgroundColor:
              theme.palette.mode === "dark" ? "grey.800" : "grey.200",
            color: theme.palette.mode === "dark" ? "grey.300" : "grey.900",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" mr={1}>
              Is this review helpful?
            </Typography>
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={() => handleVote("up")}
                  disabled={userVote !== undefined}
                  color="success"
                >
                  <ThumbUp
                    sx={{
                      color:
                        userVote === true
                          ? theme.palette.mode === "dark"
                            ? "lightgreen"
                            : "green"
                          : "grey",
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => handleVote("down")}
                  disabled={userVote !== undefined}
                  color="error"
                >
                  <ThumbDown
                    sx={{ color: userVote === false ? "red" : "grey" }}
                  />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2">
                Login to rate this review.
              </Typography>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color:
                netVotes > 0
                  ? theme.palette.mode === "dark"
                    ? "lightgreen"
                    : "green"
                  : netVotes < 0
                    ? "red"
                    : "inherit",
            }}
          >
            Net Votes: {netVotes > 0 ? `+${netVotes}` : `${netVotes}`}
          </Typography>{" "}
        </Box>
      </CardContent>
    </Card>
  );
}
