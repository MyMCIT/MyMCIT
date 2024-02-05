import {
  AccessTimeOutlined,
  BeachAccessOutlined,
  CakeOutlined,
  FunctionsOutlined,
  HikingOutlined,
  RocketLaunchOutlined,
  SentimentDissatisfiedOutlined,
  SentimentNeutralOutlined,
  SentimentSatisfiedAltOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from "@mui/icons-material";
import React, { ReactElement } from "react";

export const getDifficultyIcon = (difficulty: string): ReactElement => {
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
      return <AccessTimeOutlined />;
  }
};

export const getRatingIcon = (rating: string): ReactElement => {
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
      return <AccessTimeOutlined />;
  }
};
