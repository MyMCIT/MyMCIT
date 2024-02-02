import type { AppProps } from "next/app";
import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { useMemo, useState } from "react";

// note that since the Navbar makes use of useEffect and useState, I have turned off
// SSR for it.
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const theme = useMemo(
    () => createTheme({ palette: { mode: themeMode } }),
    [themeMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Navbar themeMode={themeMode} setThemeMode={setThemeMode} />
        <Component
          {...pageProps}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
      </Box>
    </ThemeProvider>
  );
}
