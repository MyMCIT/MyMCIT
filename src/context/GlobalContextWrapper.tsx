import React from "react";

import { ThemeContextWrapper } from "./contextWrappers/ThemeContextWrapper.tsx";

export interface GlobalContextProps {
  children: React.ReactNode;
}

// Normal react component
export const GlobalContextWrapper = ({ children }: GlobalContextProps) => {
  return <ThemeContextWrapper>{children}</ThemeContextWrapper>;
};
