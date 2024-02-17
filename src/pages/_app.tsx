import type { AppProps } from "next/app";
import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { User } from "@supabase/supabase-js";
import { authSupabase, supabase } from "@/lib/supabase";

// note that since the Navbar makes use of useEffect and useState, I have turned off
// SSR for it.
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const theme = useMemo(
    () => createTheme({ palette: { mode: themeMode } }),
    [themeMode],
  );
  // add state var for user to pass down to any given page
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const setUserAsync = async () => {
      // Get the existing session
      let { data: sessionData } = await supabase.auth.getSession();

      // get the token from the session
      const token = sessionData.session?.access_token;

      // use the token to get the user, if no token set user to null
      if (!token) {
        setUser(null);
        return;
      }

      // get a new instance of supabase client for the request with the token
      const supabaseClient = authSupabase(token);

      // fetch the user using the new instance of Supabase client
      const { data: userData, error } = await supabaseClient.auth.getUser();

      // set the user
      setUser(userData.user ?? null);
    };

    setUserAsync();

    // Listen to session changes (logging in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    // Cleanup function
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Navbar
            user={user}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />
          <Component
            user={user}
            {...pageProps}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />
        </Box>
      </ThemeProvider>
      <Analytics />
    </>
  );
}
