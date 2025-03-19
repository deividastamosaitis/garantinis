import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/app.css";
import App from "./App.jsx";
import "react-toastify/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import "flowbite";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </StrictMode>
);
