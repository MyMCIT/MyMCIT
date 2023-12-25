import { render, screen } from "@testing-library/react";
import { Course } from "../Course";
import { BrowserRouter } from "react-router-dom";

describe("App", () => {
  it("renders headline", () => {
    render(<Course />, { wrapper: BrowserRouter });

    screen.debug();

    // check if App components renders headline
  });
});
