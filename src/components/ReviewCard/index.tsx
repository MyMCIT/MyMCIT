import { useTheme, Box } from "@mui/material";

export function CourseCard() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        padding: "1rem",
        textAlign: "left",
        width: "100%",
        color: theme.palette.primary.contrastText,
        height: "fit-content",
        borderRadius: "0px",
      }}
    ></Box>
  );
}
