import React from "react";
import {
  ColorModeContext,
  SetColorModeContext,
} from "./contextWrappers/ThemeContextWrapper.tsx";

// This is a utility file for custom hooks

// 1 custom hook per context in order to expose it to consumer component

// ==================== Theme ====================
export const useColorMode = () => {
  return React.useContext(ColorModeContext);
};

export const useSetColorMode = () => {
  return React.useContext(SetColorModeContext);
};
// ==================== Theme ====================