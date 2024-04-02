import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/scss/style.scss";

import { BrowserRouter, HashRouter } from "react-router-dom";
import Scroll from "./components/Scroll";
// HashRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Scroll />
      <App />
    </HashRouter>
  </React.StrictMode>
);
