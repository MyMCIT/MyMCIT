import type { InferGetStaticPropsType, GetStaticProps, NextPage } from "next";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Grid, Button, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import { throttle } from "lodash";
import { User } from "@supabase/supabase-js";

type Course = {
  id: number;
  course_name: string;
  course_code: string;
};

export const getStaticProps: GetStaticProps<{
  courses: Course[];
}> = async () => {
  let apiUrl;

  if (process.env.NODE_ENV === "production") {
    apiUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    apiUrl = "http://localhost:3000";
  }
  const res = await fetch(`${apiUrl}/api/courses`);

  const courses: Course[] = await res.json();

  return {
    props: { courses },
    revalidate: 86400,
  };
};

export default function MyNotifications({
  courses,
  user,
}: InferGetStaticPropsType<typeof getStaticProps> & {
  user: User | null;
}) {
  const router = useRouter();

  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});

  const throttledToggleFollow = useCallback(
    throttle(
      async (courseId: string) => {
        if (!user) {
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("User object pre-fetch", user);
        const res = await fetch(`/api/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData?.session?.access_token}`,
          },
          body: JSON.stringify({ courseId }),
        });

        if (res.status !== 200) {
          throw new Error("Unable to toggle follow/unfollow status.");
        }

        const { isNowFollowing } = await res.json();
        setFollowStatus({ ...followStatus, [courseId]: isNowFollowing });
      },
      30000,
      { trailing: false },
    ),
    [followStatus, user],
  );

  // by default sort DataGrid in ascending order
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "course_code",
      sort: "asc",
    },
  ]);

  useEffect(() => {
    // fetch follow-status from '/api/follow-status' for the user here using the fetch API,
    // and set the result to followStatus state, which shows which courses the user is following.
    const fetchFollowStatus = async () => {
      if (!user) return;

      try {
        const { data: session } = await supabase.auth.getSession();

        const res = await fetch("/api/follow-status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session?.access_token}`,
          },
        });

        if (res.status === 200) {
          const coursesMap: Record<number, string> = courses.reduce(
            (a, course) => ({ ...a, [course.id]: course.course_code }),
            {},
          );
          const { followStatus } = await res.json();
          let followStatusRecord: Record<string, boolean> = {};

          followStatus.forEach((status: any) => {
            followStatusRecord[coursesMap[status.course_id]] =
              status.is_following;
          });

          setFollowStatus(followStatusRecord);
        } else {
          throw new Error("Unable to fetch follow status.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowStatus();
  }, [courses, user]);

  let rows = courses.map((course) => ({
    id: course.course_code,
    course_name: course.course_name,
    course_code: course.course_code,
    isFollowing: followStatus[course.course_code],
  }));

  const columns: GridColDef[] = [
    {
      field: "course_code",
      headerName: "Course Code",
      width: 130,
    },
    {
      field: "course_name",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "isFollowing",
      headerName: "Following",
      align: "center",
      headerAlign: "center",
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const followingValue = !!params.value;
        return (
          <Tooltip
            title={
              followingValue
                ? "You will receive email notifications when a new review for this course is posted."
                : "Click to follow this course and receive email notifications when a new review is posted."
            }
            arrow
          >
            <Button
              variant="contained"
              color={followingValue ? "secondary" : "primary"}
              onClick={() => throttledToggleFollow(String(params.id))}
              style={{ marginLeft: "20px" }}
            >
              {followingValue ? "Unfollow" : "Follow"}
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  if (user) {
    return (
      <>
        <Head>
          <title>My Notifications</title>
        </Head>
        <Box sx={{ width: "100%", pt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1} md={2}></Grid>
            <Grid item xs={12} sm={10} md={8}>
              <div style={{ height: "100%", width: "100%" }}>
                <style>
                  {`
                .MuiDataGrid-row.Mui-selected {
                background-color: rgba(0, 0, 0, 0.04) !important;
                }

                .MuiDataGrid-cell--editing {
                background-color: white;
                }

                .MuiDataGrid-row:hover {
                  cursor: pointer;
                }
                
                .MuiDataGrid-cell {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .MuiDataGrid-columnHeaderTitle {
                font-weight: bold;

              `}
                </style>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  autoHeight
                  sortModel={sortModel}
                  onSortModelChange={(model) => setSortModel(model)}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={1} md={2}></Grid>
          </Grid>
        </Box>
      </>
    );
  } else {
    // If the user is not authenticated, redirect them to the login page.

    if (typeof window !== "undefined") {
      router.replace("/login");
    }

    return null;
  }
}
