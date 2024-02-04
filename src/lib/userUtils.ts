import { Review } from "@/models/review";
import { authSupabase, supabase } from "@/lib/supabase";

// function to get the current user's ID from Supabase
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: session } = await supabase.auth.getSession();

  const token = session.session?.access_token;

  if (!token) {
    console.error("No session token found");
    return null;
  }

  // get a new instance of supabase client for the request with the token
  const supabaseClient = authSupabase(token);

  // fetch the user using the new instance of Supabase client
  const { data: userData, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Failed to fetch user data:", error.message);
    return null;
  }

  return userData.user?.id;
};

// check if the current user wrote the review
export const isCurrentUserReview = async (review: Review): Promise<boolean> => {
  const userId = await getCurrentUserId();
  return userId === review.user_id;
};
