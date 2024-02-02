// import type { InferGetStaticPropsType } from "next";
// import { Card, CardContent, Typography, Box } from "@mui/material";
// import Head from "next/head";
// import ReviewCard from "@/components/ReviewCard";
// import { supabase } from "@/lib/supabase";
// import { Review } from "@/models/review";
// import { Course } from "@/models/course";
//
// // fetch reviews and courses at build time
// export const getStaticProps = async () => {
//   let apiUrl =
//     process.env.NODE_ENV === "production"
//       ? process.env.NEXT_PUBLIC_API_URL
//       : "http://localhost:3000";
//
//   // fetch reviews
//   const resReviews = await fetch(`${apiUrl}/api/reviews`);
//   const reviews: Review[] = await resReviews.json();
//
//   // fetch courses
//   const { data: courses, error } = await supabase.from("Courses").select("*");
//
//   if (error) {
//     console.error("Error fetching courses from Supabase:", error.message);
//     throw error;
//   }
//
//   // create course lookup object
//   const courseMap = courses.reduce(
//     (acc, course) => {
//       acc[course.id] = course;
//       return acc;
//     },
//     {} as { [key: string]: Course },
//   );
//
//   // attach course data to each review
//   reviews.forEach((review) => {
//     review.course = courseMap[review.course_id];
//   });
//
//   return {
//     props: {
//       reviews,
//     },
//     revalidate: 86400,
//   };
// };
//
// export default function ReviewsPage({
//   reviews,
// }: InferGetStaticPropsType<typeof getStaticProps>) {
//   return (
//     <>
//       <Head>
//         <title>Reviews</title>
//       </Head>
//       <Typography variant="h4" align="center" gutterBottom mt={3} mb={3}>
//         All Course Reviews
//       </Typography>
//       {reviews.length > 0 ? (
//         reviews.map((review, index) => (
//           <ReviewCard review={review} key={review.id} course={review.course} />
//         ))
//       ) : (
//         <Typography align="center">No reviews available.</Typography>
//       )}
//     </>
//   );
// }
