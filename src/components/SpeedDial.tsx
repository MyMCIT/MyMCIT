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

const actions = [{ icon: <MailIcon />, name: "Contact Us" }];

const loggedInActions = [
  { icon: <Create />, name: "Create Review" },

  { icon: <MailIcon />, name: "Contact Us" },
];

export default function SpeedDialTooltipOpen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleAction = (actionName: string) => {
    handleClose();

    if (actionName === "Create Review") {
      track("Create-Review-Clicked");
      router.push("/reviews/create-review");
    }

    // if actionName equals "Contact Us", send an email to MyMCIT project team
    if (actionName === "Contact Us") {
      window.location.href = "mailto:lwinm@seas.upenn.edu";
    }
  };

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  return (
    <div>
      <SpeedDial
        ariaLabel="SpeedDial with Create Review and Contact Us options"
        icon={<SpeedDialIcon />}
        hidden={hidden}
        onClose={handleClose}
        onOpen={() => {
          track("Speed-Dial-Open", { action: "handleOpen" });
          handleOpen();
        }}
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
        {user
          ? loggedInActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handleAction(action.name)}
              />
            ))
          : actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handleAction(action.name)}
              />
            ))}
      </SpeedDial>
    </div>
  );
}
