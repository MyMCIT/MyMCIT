import { Stack, Typography } from "@mui/material";

export function CourseSummary() {
  return (
    <Stack
      direction="row"
      width="100%"
      maxWidth={950}
      height="fit-content"
      borderRadius="8px"
      sx={{
        backgroundColor: "#FFFFFF",
        color: "primary.main",
        boxShadow: "2.5px 2.5px 5px 2.5px #D3D3D3",
      }}
    >
      <Stack
        width="100%"
        paddingTop="8px"
        paddingBottom="8px"
        sx={{ borderRight: `1px solid #D3D3D3` }}
      >
        <Typography color="#7F7F7F">Reviews</Typography>
        <Typography>#</Typography>
      </Stack>
      <Stack
        width="100%"
        paddingTop="8px"
        paddingBottom="8px"
        sx={{ borderRight: `1px solid #D3D3D3` }}
      >
        <Typography color="#7F7F7F">Averaged Difficulty</Typography>
        <Typography># / 5.0</Typography>
      </Stack>
      <Stack
        width="100%"
        paddingTop="8px"
        paddingBottom="8px"
        sx={{ borderRight: `1px solid #D3D3D3` }}
      >
        <Typography color="#7F7F7F">Averaged Workload</Typography>
        <Typography> # hours / week</Typography>
      </Stack>
      <Stack width="100%" paddingTop="8px" paddingBottom="8px">
        <Typography color="#7F7F7F">Averaged Rating</Typography>
        <Typography> # / 5.0</Typography>
      </Stack>
    </Stack>
  );
}
