import { Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";

export function Footer() {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        backgroundColor: "primary.main",
        padding: "1.5rem",
        textAlign: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
        color: theme.palette.primary.contrastText,
        height: "auto",
        marginTop: "50px",
      }}
      component={"footer"}
    >
      <Typography>Created by: Connor Fech, Kris Stern, Kevin Risolo</Typography>
    </Paper>
  );
}
