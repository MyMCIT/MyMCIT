import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { useState } from "react";
import Head from "next/head";
import { CourseReviewSummary } from "@/models/course-review-summary";
import { track } from "@vercel/analytics";

export const getStaticProps: GetStaticProps<{
  courseSummaries: CourseReviewSummary[];
}> = async () => {
  let apiUrl;

  if (process.env.NODE_ENV === "production") {
    apiUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    apiUrl = "http://localhost:3000";
  }

  const res = await fetch(`${apiUrl}/api/course-summaries`);
  const courseSummaries: CourseReviewSummary[] = await res.json();

  return {
    props: { courseSummaries },
    revalidate: 86400,
  };
};
export default function Home({
  courseSummaries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // for responsive screen sizing for mobile screens
  const theme = useTheme() as Theme;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  let rows = courseSummaries.map((summary, index) => ({
    id: index,
    course_name: summary.course_name,
    course_code: summary.course_code,
    totalReviews: summary.totalReviews,
    averageDifficulty: summary.averageDifficulty.toFixed(2),
    averageWorkload: summary.averageWorkload.toFixed(2),
    averageRating: summary.averageRating.toFixed(2),
  }));

  // default sort model for the table
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "course_code", sort: "asc" },
  ]);
  const router = useRouter();

  const coreCourses = [
    "CIT-591",
    "CIT-592",
    "CIT-593",
    "CIT-594",
    "CIT-595",
    "CIT-596",
  ];

  // filters for course types
  const [filters, setFilters] = useState({
    coreCourses: true,
    electives: true,
    noReviews: false,
  });

  if (!filters.coreCourses)
    rows = rows.filter((row) => !coreCourses.includes(row.course_code));
  if (!filters.electives)
    rows = rows.filter((row) => coreCourses.includes(row.course_code));
  if (filters.noReviews) rows = rows.filter((row) => row.totalReviews == 0);
  const handleFilters = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: any,
  ) => {
    setFilters(newFilters);
  };

  const columns: GridColDef[] = [
    {
      field: "course_code",
      headerName: "ID",
      minWidth: 100,
      flex: isSmallScreen ? 0 : 1,
    },
    {
      field: "course_name",
      headerName: "Name",
      minWidth: 250,
      flex: isSmallScreen ? 0 : 10,
    },
    // hide totalReviews and averageDifficulty on smaller screens
    {
      field: "totalReviews",
      headerName: "Reviews",
      minWidth: 100,
    },
    {
      field: "averageDifficulty",
      headerName: "Difficulty (1-5)",
      minWidth: 120,
    },
    {
      field: "averageWorkload",
      headerName: "Workload (hrs/wk)",
      minWidth: 150,
    },
    { field: "averageRating", headerName: "Rating (1-5)", minWidth: 120 },
  ];

  const handleRowClick = (param: any) => {
    router.push(`/courses/${encodeURIComponent(param.row.course_code)}`);
  };

  return (
    <>
      <div>
        <Head>
          <title>MyMCIT</title>
        </Head>
      </div>
      <Box sx={{ width: "100%", pt: 5 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={isSmallScreen ? 0 : 1}
            md={isSmallScreen ? 0 : 2}
          />
          <Grid
            item
            xs={12}
            sm={isSmallScreen ? 12 : 10}
            md={isSmallScreen ? 12 : 8}
          >
            <Box my={2}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      sx={{
                        "&.MuiSwitch-root .MuiSwitch-switchBase": {
                          color: "#990000",
                        },

                        "&.MuiSwitch-root .Mui-checked": {
                          color: "#011F5B",
                        },
                      }}
                      checked={filters.coreCourses}
                      onChange={(event) => {
                        track("Core-Courses-Switch");
                        setFilters({
                          ...filters,
                          coreCourses: event.target.checked,
                        });
                      }}
                    />
                  }
                  label="Core Courses"
                />
                <FormControlLabel
                  control={
                    <Switch
                      sx={{
                        "&.MuiSwitch-root .MuiSwitch-switchBase": {
                          color: "#990000",
                        },

                        "&.MuiSwitch-root .Mui-checked": {
                          color: "#011F5B",
                        },
                      }}
                      checked={filters.electives}
                      onChange={(event) => {
                        track("Electives-Switch");
                        setFilters({
                          ...filters,
                          electives: event.target.checked,
                        });
                      }}
                    />
                  }
                  label="Electives"
                />
                <FormControlLabel
                  control={
                    <Switch
                      sx={{
                        "&.MuiSwitch-root .MuiSwitch-switchBase": {
                          color: "#990000",
                        },

                        "&.MuiSwitch-root .Mui-checked": {
                          color: "#011F5B",
                        },
                      }}
                      checked={filters.noReviews}
                      onChange={(event) => {
                        track("No-Reviews-Switch");
                        setFilters({
                          ...filters,
                          noReviews: event.target.checked,
                        });
                      }}
                    />
                  }
                  label="Only No Reviews"
                />
              </FormGroup>
            </Box>
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

                .MuiDataGrid-columnHeaderTitle {
                font-weight: bold;

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
          <Grid
            item
            xs={12}
            sm={isSmallScreen ? 0 : 1}
            md={isSmallScreen ? 0 : 2}
          ></Grid>
        </Grid>
        <SpeedDialTooltipOpen />
      </Box>
    </>
  );
}
