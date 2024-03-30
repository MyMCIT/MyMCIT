import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import MailIcon from "@mui/icons-material/Mail";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { AuthSession, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Create } from "@mui/icons-material";
import { useRouter } from "next/router";
import { track } from "@vercel/analytics";

const actions = [
  { icon: <Create />, name: "Create Review" },
  { icon: <MailIcon />, name: "Contact Us" },
];

export default function SpeedDialTooltipOpen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, session: AuthSession | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    track("Speed-Dial-Login-Click");
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://127.0.0.1:3000/";
    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            hd: "seas.upenn.edu",
          },
          redirectTo: `${baseUrl}/reviews/create-review`,
        },
      })
      .catch(console.error);
  };

  const handleAction = (actionName: string) => {
    setOpen(false);

    if (actionName === "Create Review") {
      track("Create-Review-Clicked");
      if (user) {
        router.push("/reviews/create-review");
      } else {
        handleLogin();
      }
    } else if (actionName === "Contact Us") {
      track("Contact-Us-Clicked");
      window.location.href = "mailto:lwinm@seas.upenn.edu";
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip"
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      direction="up"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      FabProps={{
        sx: {
          bgcolor: "#990000", // Penn Red per https://branding.web-resources.upenn.edu/logos-and-branding/elements-penn-logo
          "&:hover": {
            bgcolor: "#990000",
          },
        },
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => handleAction(action.name)}
        />
      ))}
    </SpeedDial>
  );
}
