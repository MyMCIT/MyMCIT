"use client";

import { Typography } from "@mui/material";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <Typography variant="h1" sx={{ textAlign: "center", mt: 4 }}>
          500 - Server-side error occurred
        </Typography>
      </body>
    </html>
  );
}
