import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { supabase } from "@/lib/supabase";

export default function AddReviewButton() {
  const router = useRouter();

  const handleAddReview = async () => {
    // retrieve current user session from supabase
    const { data: session } = await supabase.auth.getSession();

    // if there's a logged-in user, route them to the create review page, else send them to the login page
    if (session.session?.user) {
      router.push("/reviews/create-review");
    } else {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://127.0.0.1:3000/";

      await supabase.auth
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
    }
  };

  return (
    <Button
      variant="contained"
      size="large"
      fullWidth
      onClick={handleAddReview}
      sx={{
        bgcolor: "#990000", // Penn red by default
        color: "white",
        "&:hover": {
          bgcolor: "#b20000", // slightly change color on hover
        },
        "&:active": {
          bgcolor: "#011F5B", // Penn blue on user click
        },
      }}
    >
      Add New Review
    </Button>
  );
}
