import "./App.css";
import { Home } from "./Pages/Home";
import { NavBar } from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { GlobalContextWrapper } from "./context/GlobalContextWrapper.tsx";
import { Footer } from "./components/Footer";
import { Example } from "./Pages/Example";
import { Course } from "./Pages/Course";

function App() {
  return (
    <GlobalContextWrapper>
      <Box
        sx={{
          backgroundColor: "background.default",
          padding: "0rem",
        }}
        data-testid={"HERE"}
      >
        <NavBar />
        <Box sx={{ padding: "20px", minHeight: "100%" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/example" element={<Example />} />
            <Route path="*" element={<Home />} />
            <Route path="/course" element={<Course />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </GlobalContextWrapper>
  );
}

export default App;
