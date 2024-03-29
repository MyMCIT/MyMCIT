
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."calculate_course_summaries"() RETURNS TABLE("course_id" integer, "total_reviews" integer, "average_difficulty" numeric, "average_workload" numeric, "average_rating" numeric)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.course_id,
    COUNT(r.id) AS total_reviews,
    AVG(CASE r.difficulty
          WHEN 'Very Hard' THEN 5
          WHEN 'Hard' THEN 4
          WHEN 'Medium' THEN 3
          WHEN 'Easy' THEN 2
          WHEN 'Very Easy' THEN 1
          ELSE 0
        END) AS average_difficulty,
    AVG(CAST(SPLIT_PART(r.workload, ' ', 1) AS NUMERIC)) AS average_workload,
    AVG(CASE r.rating
          WHEN 'Strongly Liked' THEN 5
          WHEN 'Liked' THEN 4
          WHEN 'Neutral' THEN 3
          WHEN 'Disliked' THEN 2
          WHEN 'Strongly Disliked' THEN 1
          ELSE 0
        END) AS average_rating
  FROM
    "Reviews" r
  JOIN
    "Courses" c ON r.course_id = c.id
  GROUP BY
    r.course_id;
  
  -- Example debugging statement
  RAISE NOTICE 'Function calculate_course_summaries executed';
END;
$$;

ALTER FUNCTION "public"."calculate_course_summaries"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."calculate_course_summaries_v2"() RETURNS TABLE("course_id" bigint, "total_reviews" integer, "average_difficulty" numeric, "average_workload" numeric, "average_rating" numeric)
    LANGUAGE "sql" STABLE
    AS $$
SELECT
  r.course_id,
  COUNT(r.id) AS total_reviews,
  AVG(CASE r.difficulty
        WHEN 'Very Hard' THEN 5
        WHEN 'Hard' THEN 4
        WHEN 'Medium' THEN 3
        WHEN 'Easy' THEN 2
        WHEN 'Very Easy' THEN 1
        ELSE 0
      END) AS average_difficulty,
  AVG(CAST(SPLIT_PART(r.workload, ' ', 1) AS NUMERIC)) AS average_workload,
  AVG(CASE r.rating
        WHEN 'Strongly Liked' THEN 5
        WHEN 'Liked' THEN 4
        WHEN 'Neutral' THEN 3
        WHEN 'Disliked' THEN 2
        WHEN 'Strongly Disliked' THEN 1
        ELSE 0
      END) AS average_rating
FROM
  "Reviews" r
JOIN
  "Courses" c ON r.course_id = c.id
GROUP BY
  r.course_id;
$$;

ALTER FUNCTION "public"."calculate_course_summaries_v2"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_course_summaries"() RETURNS TABLE("course_id" integer, "total_reviews" integer, "average_difficulty" numeric, "average_workload" numeric, "average_rating" numeric)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS course_id,
    COUNT(r.id) AS total_reviews,
    AVG(CASE r.difficulty
          WHEN 'Very Hard' THEN 5
          WHEN 'Hard' THEN 4
          WHEN 'Medium' THEN 3
          WHEN 'Easy' THEN 2
          WHEN 'Very Easy' THEN 1
        END) AS average_difficulty,
    AVG(CAST(SPLIT_PART(r.workload, ' ', 1) AS NUMERIC)) AS average_workload,
    AVG(CASE r.rating
          WHEN 'Strongly Liked' THEN 5
          WHEN 'Liked' THEN 4
          WHEN 'Neutral' THEN 3
          WHEN 'Disliked' THEN 2
          WHEN 'Strongly Disliked' THEN 1
        END) AS average_rating
  FROM
    "Courses" c
    LEFT JOIN "Reviews" r ON c.id = r.course_id
  GROUP BY
    c.id;
END;
$$;

ALTER FUNCTION "public"."get_course_summaries"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Course_Professors" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "course_id" bigint,
    "professor_id" bigint
);

ALTER TABLE "public"."Course_Professors" OWNER TO "postgres";

ALTER TABLE "public"."Course_Professors" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Course_Professors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Courses" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "course_name" "text",
    "course_code" "text"
);

ALTER TABLE "public"."Courses" OWNER TO "postgres";

ALTER TABLE "public"."Courses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Courses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Professors" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text"
);

ALTER TABLE "public"."Professors" OWNER TO "postgres";

ALTER TABLE "public"."Professors" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Professors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Reviews" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "rating" "text",
    "difficulty" "text",
    "semester" "text",
    "workload" "text",
    "comment" "text",
    "legacy_date" "text",
    "legacy_course_name" "text",
    "course_id" bigint,
    "user_id" "uuid"
);

ALTER TABLE "public"."Reviews" OWNER TO "postgres";

ALTER TABLE "public"."Reviews" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."Course_Professors"
    ADD CONSTRAINT "Course_Professors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Courses"
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Professors"
    ADD CONSTRAINT "Professors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Reviews"
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Course_Professors"
    ADD CONSTRAINT "Course_Professors_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Courses"("id");

ALTER TABLE ONLY "public"."Course_Professors"
    ADD CONSTRAINT "Course_Professors_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."Professors"("id");

ALTER TABLE ONLY "public"."Reviews"
    ADD CONSTRAINT "Reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Courses"("id");

ALTER TABLE ONLY "public"."Reviews"
    ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE "public"."Course_Professors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Courses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable delete for users based on user_id" ON "public"."Reviews" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."Reviews" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."Course_Professors" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Courses" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Professors" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Reviews" FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON "public"."Reviews" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

ALTER TABLE "public"."Professors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Reviews" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."calculate_course_summaries"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_course_summaries"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_course_summaries"() TO "service_role";

GRANT ALL ON FUNCTION "public"."calculate_course_summaries_v2"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_course_summaries_v2"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_course_summaries_v2"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_course_summaries"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_course_summaries"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_course_summaries"() TO "service_role";

GRANT ALL ON TABLE "public"."Course_Professors" TO "anon";
GRANT ALL ON TABLE "public"."Course_Professors" TO "authenticated";
GRANT ALL ON TABLE "public"."Course_Professors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Course_Professors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Course_Professors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Course_Professors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Courses" TO "anon";
GRANT ALL ON TABLE "public"."Courses" TO "authenticated";
GRANT ALL ON TABLE "public"."Courses" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Courses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Courses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Courses_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Professors" TO "anon";
GRANT ALL ON TABLE "public"."Professors" TO "authenticated";
GRANT ALL ON TABLE "public"."Professors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Professors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Professors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Professors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Reviews" TO "anon";
GRANT ALL ON TABLE "public"."Reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."Reviews" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Reviews_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
