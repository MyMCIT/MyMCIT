import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/*Browser router provides react router access to the App and all of its children*/}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
