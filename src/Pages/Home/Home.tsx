import { Box, Button, Typography } from "@mui/material";
import {
  firebaseDeleteAll,
  firebaseDeleteByID,
  fireBaseGetOnce,
  firebaseReadRealTime,
  firebaseSet,
  firebaseUpdate,
} from "../../utils/firebase-db.ts";
import { useEffect } from "react";
import Divider from "@mui/material/Divider";
import {
  handleSignOut,
  handleSignIn,
  dumpSignedInUser,
} from "../../utils/firebase-auth.ts";

export function Home() {
  useEffect(() => {
    console.log("mounted home");
    // TODO - for some reason this is being called alot, maybe just want to use getOnce
    firebaseReadRealTime();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          height: "auto",
          width: "80%",
          marginTop: "10vh",
          marginBottom: { xs: "5vh", sm: "3vh", md: "0vh" },
          textAlign: "left",
        }}
      >
        <Typography>This is an example project</Typography>
        <Button
          onClick={() => {
            fireBaseGetOnce("courses");
          }}
        >
          fetch real courses
        </Button>
        <Divider />

        <Button onClick={firebaseSet}>create</Button>
        <Button
          onClick={() => {
            fireBaseGetOnce("test/courses");
          }}
        >
          fetch
        </Button>
        <Button
          onClick={() => {
            firebaseUpdate(1);
          }}
        >
          update
        </Button>
        <Button
          onClick={() => {
            firebaseDeleteByID(0);
          }}
        >
          deleteById
        </Button>
        <Button onClick={firebaseDeleteAll}>deleteAll</Button>

        <Divider />
        <Button onClick={handleSignIn}>Sign In</Button>
        <Button onClick={dumpSignedInUser}>Print User Details</Button>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </Box>
    </Box>
  );
}
