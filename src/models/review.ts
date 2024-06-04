import { Course } from "@/models/course";

export type Review = {
  id: number;
  course_id: number;
  created_at: string;
  semester: string;
  difficulty: string;
  workload: string;
  rating: string;
  comment: string;
  course: Course;
  user_id?: string;
};
