import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ConfirmProvider } from "material-ui-confirm";
ReactDOM.render(
  <React.StrictMode>
    <ConfirmProvider>
      <App />
    </ConfirmProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
