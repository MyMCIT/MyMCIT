export function mapColorToDifficulty(difficulty: string) {
  switch (difficulty) {
    case "Very Easy":
      return "#1b5e20";
    case "Easy":
      return "#66bb6a";
    case "Medium":
      return "#ffcc80";
    case "Hard":
      return "#fb8c00";
    case "Very Hard":
      return "#d32f2f";
    default:
      return undefined;
  }
}

export function mapColorToRating(difficulty: string) {
  switch (difficulty) {
    case "Strongly Liked":
      return "#1b5e20";
    case "Liked":
      return "#66bb6a";
    case "Neutral":
      return "#ffcc80";
    case "Disliked":
      return "#fb8c00";
    case "Strongly Disliked":
      return "#d32f2f";
    default:
      return undefined;
  }
}
