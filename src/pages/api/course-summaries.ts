"use client";

import { supabase } from "../../lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { CourseReviewSummary } from "@/models/course-review-summary";

const difficultyMap = {
  "Very Hard": 5,
  Hard: 4,
  Medium: 3,
  Easy: 2,
  "Very Easy": 1,
};

const ratingMap = {
  "Strongly Liked": 5,
  Liked: 4,
  Neutral: 3,
  Disliked: 2,
  "Strongly Disliked": 1,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CourseReviewSummary[] | { error: string }>,
) {
  console.log("API endpoint /api/course-summaries accessed...");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // fetch all courses
    const { data: courses, error: coursesError } = await supabase
      .from("Courses")
      .select("*");
    if (coursesError || !courses) {
      console.error(
        "Error fetching courses from Supabase:",
        coursesError?.message,
      );
      return res
        .status(500)
        .json({ error: coursesError?.message || "Failed to fetch courses" });
    }

    // fetch all reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("Reviews")
      .select("*");
    if (reviewsError || !reviews) {
      console.error(
        "Error fetching reviews from Supabase:",
        reviewsError?.message,
      );
      return res
        .status(500)
        .json({ error: reviewsError?.message || "Failed to fetch reviews" });
    }

    // map to keep track of review summaries for each course
    const reviewSummaries = courses.map((course) => {
      const filteredReviews = reviews.filter(
        (review) => review.course_id === course.id,
      );
      const totalReviews = filteredReviews.length;
      const averageDifficulty =
        filteredReviews.reduce(
          (acc, curr) =>
            acc +
            (difficultyMap[curr.difficulty as keyof typeof difficultyMap] || 0),
          0,
        ) / totalReviews || 0;
      const averageRating =
        filteredReviews.reduce(
          (acc, curr) =>
            acc + (ratingMap[curr.rating as keyof typeof ratingMap] || 0),
          0,
        ) / totalReviews || 0;
      const averageWorkload =
        filteredReviews.reduce(
          (acc, curr) => acc + parseInt(curr.workload.match(/\d+/)?.[0] || "0"),
          0,
        ) / totalReviews || 0;

      return {
        id: course.id,
        course_name: course.course_name,
        course_code: course.course_code,
        totalReviews,
        averageDifficulty: Number(averageDifficulty.toFixed(2)),
        averageWorkload: Number(averageWorkload.toFixed(2)),
        averageRating: Number(averageRating.toFixed(2)),
      };
    });

    return res.status(200).json(reviewSummaries);
  } catch (e: any) {
    console.error("An error occurred:", e.message);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
