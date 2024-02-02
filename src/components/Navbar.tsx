"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  MenuItem,
  Menu,
  useMediaQuery,
  useTheme,
  Hidden,
} from "@mui/material";
import {
  AccountCircle,
  Brightness3,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { User, AuthSession } from "@supabase/supabase-js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/system";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { track } from "@vercel/analytics";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: none;
  }
`;

function UserComponent() {
  const router = useRouter();

  const handleUserNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  const [user, setUser] = useState<User | null>(null);
  // Additional state for managing the menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: AuthSession | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (user) {
    return (
      <div>
        <IconButton
          onClick={handleMenu}
          size="large"
          edge="end"
          style={{ color: "white" }}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "rotate(45deg)",
                zIndex: 0,
              },
            },
            transformOrigin: "top right",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }}
        >
          <MenuItem onClick={() => handleUserNavigation("/reviews/my-reviews")}>
            My Reviews
          </MenuItem>
          <MenuItem
            onClick={() => {
              track("Logout");
              supabase.auth.signOut();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        track("LoginClick");
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_URL
            : "http://localhost:3000";
        supabase.auth
          .signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${baseUrl}`, // redirect to route after OAuth complete
            },
          })
          .catch(console.error);
      }}
      style={{ color: "white" }}
    >
      LOGIN
    </Button>
  );
}

export default function Navbar({ themeMode, setThemeMode }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  function handleThemeChange() {
    track("ThemeChange");
    setThemeMode((prev: string) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#011F5B" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <StyledLink href="/" passHref>
            <Image
              src="/upenn-logo.svg"
              alt="UPenn Logo"
              height={48}
              width={48}
            />
          </StyledLink>
          <StyledLink
            href="/"
            passHref
            onClick={() => track("MyMCIT-Icon-Click")}
          >
            <Typography variant="h6" component="div" sx={{ ml: 2 }}>
              MyMCIT
            </Typography>
          </StyledLink>
          <Hidden smDown>
            <div style={{ display: "flex", alignItems: "center" }}>
              <StyledLink
                href="/"
                passHref
                onClick={() => track("Courses-Navbar-Click")}
              >
                <Typography variant="subtitle1" component="div" sx={{ ml: 2 }}>
                  Courses
                </Typography>
              </StyledLink>
              <StyledLink
                href="/reviews"
                passHref
                onClick={() => track("Reviews-Navbar-Click")}
              >
                <Typography variant="subtitle1" component="div" sx={{ ml: 2 }}>
                  Reviews
                </Typography>
              </StyledLink>
            </div>
          </Hidden>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleThemeChange}>
            {themeMode === "light" ? <Brightness7 /> : <Brightness3 />}
          </IconButton>
          <UserComponent />
        </div>
      </Toolbar>
    </AppBar>
  );
}
