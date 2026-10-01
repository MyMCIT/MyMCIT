"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import {
  Box,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const theme = useMemo(
    () => createTheme({ palette: { mode: themeMode } }),
    [themeMode],
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Navbar themeMode={themeMode} setThemeMode={setThemeMode} />
          {children}
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
