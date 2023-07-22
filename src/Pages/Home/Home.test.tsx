import { render, screen } from "@testing-library/react";
import { Home } from "./Home.tsx";
import { BrowserRouter } from "react-router-dom";

describe("App", () => {
  it("renders headline", () => {
    render(<Home />, { wrapper: BrowserRouter });

    screen.debug();

    // check if App components renders headline
  });
});
