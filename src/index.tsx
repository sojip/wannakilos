import React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./components/auth/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
