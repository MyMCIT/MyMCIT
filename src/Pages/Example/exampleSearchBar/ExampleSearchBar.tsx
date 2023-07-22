import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface ExampleSearchBarProps {
  listItems: string[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateExampleList: Function;
}

export const ExampleSearchBar = ({
  listItems,
  updateExampleList,
}: ExampleSearchBarProps) => {
  const [currentValue, setCurrentValue] = useState<string>("");

  const addItemToList = () => {
    const newList = [...listItems];

    // Add the element to the beginning of the array
    newList.unshift(currentValue);
    console.log(newList);

    // passes new list to the parent component
    updateExampleList(newList);
    // Reset the search bar value
    setCurrentValue("");

    // Add it to the local storage
    localStorage.setItem("example-list", JSON.stringify(newList));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { sm: "column", md: "row" },
        alignItems: { sm: "center", md: "flex-end" },
        justifyContent: "space-evenly",
      }}
    >
      <TextField
        id="standard-basic"
        label="Add to list"
        variant="standard"
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value);
        }}
        onKeyDown={(ev) => {
          console.log(`Pressed keyCode ${ev.key}`);
          if (ev.key === "Enter" && currentValue.length > 0) {
            addItemToList();
          }
        }}
      />
      <Button
        sx={{ marginTop: { sm: "0.5rem", md: "0" } }}
        variant={"contained"}
        onClick={() => {
          if (currentValue.length > 0) {
            addItemToList();
          }
        }}
      >
        Submit
      </Button>
    </Box>
  );
};
