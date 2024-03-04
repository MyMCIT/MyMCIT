'use client'

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

type Course = {
  id: number;
  course_name: string;
  course_code: string;
};

export const getStaticProps: GetStaticProps<{
  courses: Course[];
}> = async () => {
  try {
    let apiUrl;

    if (process.env.NODE_ENV === "production") {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
    } else {
      apiUrl = "http://127.0.0.1:3000";
    }
    const res = await axios(`${apiUrl}/api/courses`);

    const courses: Course[] = await res.data;

    console.log("Courses frontend: ", courses);

    return {
      props: {courses},
      revalidate: 86400,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching courses:", error.message);
    }
  }
  return {
    props: {
      courses: [],
    },
  };
};

export default function Courses({
  courses,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  let rows = courses.map((course, index) => ({
    id: index,
    course_name: course.course_name,
    course_code: course.course_code,
  }));

  // default sort model for the table
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "course_code", sort: "asc" },
  ]);

  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "course_code", headerName: "ID", width: 100 },
    {
      field: "course_name",
      headerName: "Name",
      flex: 1,
    },
  ];

  const handleRowClick = (param: any) => {
    router.push(`/courses/${encodeURIComponent(param.row.course_code)}`);
  };

  return (
    <>
      <div>
        <Head>
          <title>Courses</title>
        </Head>
      </div>
      <Box sx={{ width: "100%", pt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={1} md={2}></Grid>
          <Grid item xs={12} sm={10} md={8}>
            <div style={{ height: "100%", width: "100%" }}>
              <style>
                {`
                  .MuiDataGrid-row:hover {
                    cursor: pointer;
                  }

                  .MuiDataGrid-columnHeaderTitle {
                    font-weight: bold;
                  }
                `}
              </style>
              <DataGrid
                rows={rows}
                columns={columns}
                onRowClick={handleRowClick}
                autoHeight // setting autoHeight to adjust grid height to content
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
}
