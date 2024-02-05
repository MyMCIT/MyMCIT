import { ChipPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";

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

export const getDifficultyColor = (value: string): ChipColor =>
  difficultyColors[value as keyof typeof difficultyColors];

export const getRatingColor = (value: string): ChipColor =>
  ratingColors[value as keyof typeof ratingColors];
