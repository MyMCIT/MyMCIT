import { render, screen } from "@testing-library/react";
import { Index } from "./index.tsx";
import { BrowserRouter } from "react-router-dom";

describe("App", () => {
  it("renders headline", () => {
    render(<Index />, { wrapper: BrowserRouter });

    screen.debug();

    // check if App components renders headline
  });
});
