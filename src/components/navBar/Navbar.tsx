import { useTheme } from "@mui/material";
import { ThemeToggle } from "../themeToggle/ThemeToggle.tsx";
import MenuIcon from "@mui/icons-material/Menu";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { NavbarDrawer } from "./NavbarDrawer.tsx";

import { NavLink, useLocation } from "react-router-dom";

interface navBarProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}
export function Navbar({ window }: navBarProps) {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState: any) => !prevState);
  };

  const CustomListItemButton = ({ to, primary, fullWidth }: any) => {
    const theme = useTheme();
    const location = useLocation();
    const [selected, setSelected] = useState<boolean>(to === location.pathname);

    useEffect(() => {
      if (location) {
        setSelected(to === location.pathname);
      }
    }, [location]);

    const selectedStyles = {
      borderBottom: "5px solid",
      borderColor: theme.palette.background.paper,
      textAlign: "center",

      "&:hover": {
        borderBottom: "5px solid",
        borderColor: theme.palette.secondary.main,
        borderRadius: "5px",
      },
    };

    const unselectedStyles = {
      borderBottom: "5px solid",
      borderColor: "transparent",
      "&:hover": {
        borderBottom: "5px solid",
        borderColor: theme.palette.secondary.main,
        borderRadius: "5px",
      },
    };

    return (
      <ListItem sx={{ width: fullWidth ? "100%" : "fit-content" }}>
        <ListItemButton
          component={NavLink}
          to={to}
          sx={selected ? selectedStyles : unselectedStyles}
        >
          {primary}
        </ListItemButton>
      </ListItem>
    );
  };

  // ====================================================================

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ marginBottom: "5rem" }}>
      <AppBar
        component="nav"
        sx={{ backgroundColor: "primary.main", backgroundImage: "none" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            justifyContent="center"
            alignItems="center"
            component={NavLink}
            sx={{
              textDecoration: "none",
              color: "inherit",
              textAlign: "center",
              backgroundColor: "primary.main",
              display: { xs: "none", sm: "flex" },
              cursor: "pointer",
              minWidth: "fit-content",
            }}
            to={"/"}
          >
            <Typography variant="h6" color="inherit" component="h1">
              My MCIT
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              marginLeft: "auto",
              width: "90%",
              justifyContent: "flex-start",
              height: "64px",
              alignItems: "center",
            }}
          >
            <CustomListItemButton to={"/"} primary={"Home"} />
            {/*<CustomListItemButton to={"/example"} primary={"Example"} />*/}
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {<NavbarDrawer handleDrawerToggle={handleDrawerToggle} />}
        </Drawer>
      </Box>
    </Box>
  );
}
