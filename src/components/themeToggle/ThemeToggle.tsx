import { useEffect } from "react";
import { Box, IconButton, PaletteMode } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode, useSetColorMode } from "../../context/customHooks.ts";

export const ThemeToggle = () => {
  const mode = useColorMode();

  // TODO - figure out what type this should be
  const setMode: any = useSetColorMode();

  useEffect(() => {
    if (localStorage.getItem("mode") === null) {
      localStorage.setItem("mode", "light");
    }
    const mode: PaletteMode = localStorage.getItem("mode") as PaletteMode;
    setMode(mode);
  }, [setMode]);

  const toggleColorMode = () => {
    setMode(mode == "light" ? "dark" : "light");

    localStorage.setItem(
      "mode",
      localStorage.getItem("mode") === "light" ? "dark" : "light"
    );
  };
  return (
    <Box sx={{ flexGrow: "1", justifyContent: "end", textAlign: "end" }}>
      <IconButton
        sx={{
          padding: "1px 6px",
          height: "80%",
          margin: "auto, 1rem, auto, 1rem",
        }}
        onClick={toggleColorMode}
        color="inherit"
      >
        {mode == "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};
