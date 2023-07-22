// @ts-ignore
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { UserData } from "../../../Interfaces.ts";

interface UserTableProps {
  userData: UserData[];
}

const UserTable = ({ userData }: UserTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: "100%", overflowX: "scroll" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Image</TableCell>
            <TableCell align="center">First Name</TableCell>
            <TableCell align="center">Last Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.length > 0
            ? userData.map((user: UserData) => (
                <TableRow
                  key={user.name.first}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    <img src={user.picture.thumbnail} />
                  </TableCell>
                  <TableCell align="center">{user.name.first}</TableCell>
                  <TableCell align="center">{user.name.last}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
