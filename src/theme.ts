import { PaletteMode } from "@mui/material";

// Will create a new theme and override the passed in values of the  default MUI theme
// Can read more about MUI theme and crete theme
// https://mui.com/material-ui/customization/default-theme/
// https://mui.com/material-ui/customization/theming/#custom-variables
// creating a custom light and dark theme https://mui.com/material-ui/customization/dark-mode/

// This will allow us to create custom overrides of the default theme with a light and dark mode
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#1d3557",
          },
          secondary: {
            main: "#e63946",
          },
          background: {
            paper: "#f1faee",
            default: "#f1faee",
          },
        }
      : {
          primary: {
            main: "#2f3e46",
          },
          secondary: {
            main: "#e63946",
          },
          background: {
            paper: "#354f52",
            default: "#354f52",
          },
        }),
  },
});
