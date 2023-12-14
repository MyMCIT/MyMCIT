import { useEffect } from "react";
import { Stack } from "@mui/material";
import {
  // createItem,
  // fetchCourses,
  // firebaseDeleteAll,
  // firebaseDeleteByID,
  // fireBaseGetOnce,
  firebaseReadRealTime,
  // firebaseSet,
  // firebaseUpdate,
} from "../../utils/firebase-db.ts";
// import Divider from "@mui/material/Divider";
// import {
//   handleSignOut,
//   handleSignIn,
//   dumpSignedInUser,
// } from "../../utils/firebase-auth.ts";
// import { Review } from "../../Interfaces.ts";
import { CourseSummary } from "../../components/CourseSummary";

export function Course() {
  useEffect(() => {
    console.log("mounted home");
    // TODO - for some reason this is being called alot, maybe just want to use getOnce
    firebaseReadRealTime();
  }, []);

  // const testCourses = {
  //   0: {
  //     courseID: "CIT591",
  //   },
  //   1: {
  //     courseID: "CIT592",
  //   },
  //
  //   2: {
  //     courseID: "CIT593",
  //   },
  // };

  return (
    <Stack alignItems="center">
      <CourseSummary />
    </Stack>
  );
}
