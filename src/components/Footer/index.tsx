import { Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";

export function Footer() {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        backgroundColor: "primary.main",
        padding: "1rem",
        textAlign: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
        color: theme.palette.primary.contrastText,
        height: "fit-content",
        borderRadius: "0px",
      }}
      component={"footer"}
    >
      <Typography>&copy; MCIT MOSA</Typography>
    </Paper>
  );
}
