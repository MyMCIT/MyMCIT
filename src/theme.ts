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
            main: "#1976d2",
          },
          secondary: {
            main: "#9c27b0",
          },
          background: {
            paper: "#fff",
            default: "#fff",
          },
        }
      : {
          primary: {
            main: "#4b5ea6",
          },
          secondary: {
            main: "#EA463A",
          },
          background: {
            paper: "#424242",
            default: "#303030",
          },
        }),
  },
});
