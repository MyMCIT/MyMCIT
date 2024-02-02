import { supabase } from "../../lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Course } from "@/models/course";
import { ErrorMessage } from "@/models/error-message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Course[] | ErrorMessage>,
) {
  console.log("API endpoint /api/courses accessed...");

  if (req.method === "GET") {
    const courseCodeRaw = req.query.course_code;

    // Check if course_code is a single string or an array of strings
    if (typeof courseCodeRaw === "string") {
      // Fetch a single course that matches the provided course code
      const { data: course, error } = await supabase
        .from("Courses")
        .select("*")
        .eq("course_code", courseCodeRaw);

      if (error) {
        console.error("Error fetching from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      if (course.length === 0) {
        const notFoundMessage = `Course with code ${courseCodeRaw} not found.`;
        console.error(notFoundMessage);
        return res.status(404).json({ error: notFoundMessage });
      }

      return res.status(200).json(course);
    } else if (Array.isArray(courseCodeRaw)) {
      // Fetch courses that match any of the provided course codes
      const { data: courses, error } = await supabase
        .from("Courses")
        .select("*")
        .in("course_code", courseCodeRaw);

      if (error) {
        console.error("Error fetching from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      if (courses.length === 0) {
        const notFoundMessage = `Courses with codes ${courseCodeRaw.join(", ")} not found.`;
        console.error(notFoundMessage);
        return res.status(404).json({ error: notFoundMessage });
      }

      return res.status(200).json(courses);
    } else {
      // Fetch all courses if no specific course codes are provided
      const { data: courses, error } = await supabase
        .from("Courses")
        .select("*");

      if (error) {
        console.error("Error fetching from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(courses || []);
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
