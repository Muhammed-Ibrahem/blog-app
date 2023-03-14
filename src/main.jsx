import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Authentication from "../firebase/Authentication";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>

  <BrowserRouter>
    <Authentication>
      <App />
    </Authentication>
  </BrowserRouter>

  // </React.StrictMode>
);
