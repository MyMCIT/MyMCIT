import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { ListItemButton } from "@mui/material";

interface exampleListProps {
  listItems: string[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateExampleList: Function;
}

export const ExampleList = ({
  listItems,
  updateExampleList,
}: exampleListProps) => {
  /**
   * Utilty method for removing items
   * @param strIndex
   */
  const removeListItem = (strIndex: string) => {
    // Get the index of the element to remove from the passed in string
    const index = parseInt(strIndex);

    // Make a copy of the state as not to mutate it in this component
    const newLst = [...listItems];

    // remove the element from the list
    newLst.splice(index, 1);
    console.log(newLst);

    // passes new list to the parent component to update the state
    updateExampleList(newLst);

    // Update the local storage with the new list value
    localStorage.setItem("example-list", JSON.stringify(newLst));
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Test List
      </Typography>
      <List
        sx={{
          width: "80%",
          margin: "auto",
          maxHeight: "400px",
          overflowY: "scroll",
        }}
      >
        {listItems.map((item, index) => {
          console.log(item, index);
          return (
            <ListItem
              disablePadding
              key={index}
              divider
              sx={{ backgroundColor: "primary.light", color: "text.primary" }}
            >
              <ListItemButton
                // Assign a data-idx to the list item button so we know which index is clicked on
                data-idx={index}
                onClick={(e) => {
                  removeListItem(e.currentTarget.dataset.idx!);
                }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
