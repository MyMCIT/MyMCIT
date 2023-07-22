import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import UserTable from "./userTable/UserTable.tsx";
import { useEffect, useState } from "react";
import { UserData } from "../../Interfaces.ts";
import axios from "axios";
import { ExampleList } from "./exampleList/ExampleList.tsx";
import { ExampleSearchBar } from "./exampleSearchBar/ExampleSearchBar.tsx";

export function Example() {
  const [randomUsers, setRandomUsers] = useState<UserData[]>([]);

  // List item state is maintained in the parent component
  const [listItems, setListItems] = useState<string[]>([]);

  // Get theme object from MUI
  const theme = useTheme();

  // Check the console to view the theme object
  useEffect(() => {
    console.log(theme);
  });

  // Example of how to import an environment variable
  useEffect(() => {
    const envTest = import.meta.env.VITE_TEST;
    console.log(envTest);

    const url = `https://google.com?apikey=${import.meta.env.VITE_API_KEY}`;
    console.log({ url });
    console.log(
      `${envTest} you can use backticks to inject the variable into a string`
    );
  }, []);

  // On mount call the get from localStorage method to set the state of listItems
  useEffect(() => {
    getFromLocalStorage();
  }, []);

  /**
   * Get the example list from local storage on component mount
   */
  const getFromLocalStorage = () => {
    const list = JSON.parse(localStorage.getItem("example-list") || "[]");
    setListItems(list);
  };

  /**
   * Helper method that is passed down to a child of this component
   * This allows us to update the state of listItems from a child component and then share it with another component
   * @param exampleList
   */
  const updateExampleList = (exampleList: string[]) => {
    console.log("called");
    console.log(exampleList);
    setListItems(exampleList);
  };

  // Example of how to make an api call
  const getUsers = async () => {
    axios
      .get("https://randomuser.me/api/?results=5")
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setRandomUsers(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // MUI pallet can be accessed by the string notation as seen here
    <Box>
      {/*Grid allows us to easily create pages layouts*/}
      {/*The numbers of each grid container must add up to 12*/}
      {/*sm={8} means the component will take up 8/12 sections of the screen.*/}
      {/*Once the screen is smaller than sm (900 px) then the item will take up the full width*/}
      <Grid container>
        <Grid item sm={8} sx={{ border: "3px solid red", overflowX: "scroll" }}>
          <Typography variant={"h4"} color="text.primary">
            Click the button to get some random user data
          </Typography>

          {/*MUI theme can be accessed by the object notation as seen here*/}
          <Button
            data-testid={"get-users-button"}
            onClick={getUsers}
            variant={"contained"}
          >
            Get Users
          </Button>
          <h1>Users:</h1>
          <UserTable userData={randomUsers} />
        </Grid>

        {/*Custom Spacer*/}
        <Grid
          item
          sm={1}
          sx={{
            border: "3px solid yellow",
            display: { xs: "none", sm: "block" },
          }}
        >
          <Divider orientation="vertical" flexItem />
        </Grid>

        {/*Search bar and list component*/}
        <Grid item sm={3} xs sx={{ border: "3px solid green" }}>
          {/*Passing the update example list method and the listItems as props  to be used by the Example search bar*/}
          <ExampleSearchBar
            listItems={listItems}
            updateExampleList={updateExampleList}
          />

          {/*Passing the update example list method and the listItems  as props to be used by the Example List*/}
          <ExampleList
            listItems={listItems}
            updateExampleList={updateExampleList}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
