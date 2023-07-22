import { Box, Typography } from "@mui/material";

export function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          height: "auto",
          width: "80%",
          marginTop: "10vh",
          marginBottom: { xs: "5vh", sm: "3vh", md: "0vh" },
          textAlign: "left",
        }}
      >
          <Typography>This is an example project</Typography>
      </Box>
    </Box>
  );
}
