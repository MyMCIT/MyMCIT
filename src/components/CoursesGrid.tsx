"use client";

import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";
import { useState } from "react";
import type { Course } from "@/models/course";

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  const rows = courses.map((course, index) => ({
    id: index,
    course_name: course.course_name,
    course_code: course.course_code,
  }));

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

  return (
    <Box sx={{ width: "100%", pt: 5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 1, md: 2 }} />
        <Grid size={{ xs: 12, sm: 10, md: 8 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            onCellClick={(param) => {
              if (!param.row.course_code) {
                return;
              }
              router.push(
                `/courses/${encodeURIComponent(param.row.course_code)}`,
              );
            }}
            disableRowSelectionOnClick
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            sx={{
              "& .MuiDataGrid-row:hover": { cursor: "pointer" },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 1, md: 2 }} />
      </Grid>
    </Box>
  );
}
