"use client";

import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SpeedDialTooltipOpen from "@/components/SpeedDial";
import { useState } from "react";
import { CourseReviewSummary } from "@/models/course-review-summary";
import { track } from "@vercel/analytics";

export default function HomeCourseGrid({
  courseSummaries,
}: {
  courseSummaries: CourseReviewSummary[];
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  let rows = courseSummaries.map((summary, index) => ({
    id: index,
    course_name: summary.course_name,
    course_code: summary.course_code,
    totalReviews: summary.totalReviews,
    averageDifficulty: summary.averageDifficulty.toFixed(2),
    averageWorkload: summary.averageWorkload.toFixed(2),
    averageRating: summary.averageRating.toFixed(2),
  }));

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "course_code", sort: "asc" },
  ]);

  const coreCourses = [
    "CIT-5910",
    "CIT-5920",
    "CIT-5930",
    "CIT-5940",
    "CIT-5950",
    "CIT-5960",
  ];

  const [filters, setFilters] = useState({
    coreCourses: true,
    electives: true,
    noReviews: false,
  });

  if (!filters.coreCourses) {
    rows = rows.filter((row) => !coreCourses.includes(row.course_code));
  }
  if (!filters.electives) {
    rows = rows.filter((row) => coreCourses.includes(row.course_code));
  }
  if (filters.noReviews) {
    rows = rows.filter((row) => row.totalReviews == 0);
  }

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
      type: "number",
    },
    { field: "averageRating", headerName: "Rating (1-5)", minWidth: 120 },
  ];

  return (
    <Box sx={{ width: "100%", pt: 5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: isSmallScreen ? 12 : 1, md: isSmallScreen ? 12 : 2 }} />
        <Grid size={{ xs: 12, sm: isSmallScreen ? 12 : 10, md: isSmallScreen ? 12 : 8 }}>
          <Box sx={{ my: 2 }}>
            <FormGroup
              row
              sx={{ justifyContent: "center", m: isSmallScreen ? 1 : 0 }}
            >
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
          <Box sx={{ width: "100%", height: 650, pt: 5 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              pageSizeOptions={[10, 25, 100]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              onCellClick={(param) => {
                if (!param.row.course_code) {
                  return;
                }
                track(`${param.row.course_code}-Row-Clicked`);
                router.push(
                  `/courses/${encodeURIComponent(param.row.course_code)}`,
                );
              }}
              disableRowSelectionOnClick
              showToolbar
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              sx={{
                height: 600,
                "& .MuiDataGrid-row:hover": { cursor: "pointer" },
                "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: isSmallScreen ? 12 : 1, md: isSmallScreen ? 12 : 2 }} />
      </Grid>
      <SpeedDialTooltipOpen />
    </Box>
  );
}
